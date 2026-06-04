import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { v4 as uuid } from "uuid";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto, SignupDto } from "./dto/auth.dto";

const WELCOME_BONUS = 10;
const REF_RATES: Record<1 | 2 | 3, number> = { 1: 0.10, 2: 0.05, 3: 0.02 };

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const phone = normalizePkPhone(dto.phone);

    const [byUsername, byPhone, byEmail] = await Promise.all([
      this.prisma.user.findUnique({ where: { username: dto.username.toLowerCase() } }),
      this.prisma.user.findUnique({ where: { phone } }),
      dto.email ? this.prisma.user.findUnique({ where: { email: dto.email } }) : null,
    ]);
    if (byUsername) throw new ConflictException("Yeh username pehle se istemaal ho raha hai.");
    if (byPhone) throw new ConflictException("Yeh phone number pehle se registered hai.");
    if (byEmail) throw new ConflictException("Email pehle se registered hai.");

    const passwordHash = await argon2.hash(dto.password);
    const referralCode = generateRefCode();

    let referredById: string | null = null;
    if (dto.referralCode) {
      const ref = await this.prisma.user.findUnique({ where: { referralCode: dto.referralCode } });
      if (!ref) throw new BadRequestException("Referral code ghalat hai.");
      referredById = ref.id;
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName.trim(),
        displayName: dto.fullName.trim().split(" ")[0],
        username: dto.username.toLowerCase(),
        gender: dto.gender,
        city: dto.city,
        country: "PK",
        phone,
        password: passwordHash,
        referralCode,
        referredById,
        wallet: { create: {} },
        lastActiveAt: new Date(),
      },
      include: { wallet: true },
    });

    // Build referral chain (L1, L2, L3)
    if (referredById) await this.linkReferralChain(referredById, user.id);

    // Welcome bonus
    await this.creditWelcomeBonus(user.id);

    const tokens = await this.issueTokens(user.id);
    return { user: sanitize(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const id = dto.identifier.trim().toLowerCase();
    // Allow login by username, email, or phone.
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: id }, { email: id }, { phone: normalizePkPhone(dto.identifier) }],
      },
    });
    if (!user?.password) throw new UnauthorizedException("Galat username ya password.");
    const ok = await argon2.verify(user.password, dto.password);
    if (!ok) throw new UnauthorizedException("Galat username ya password.");

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    const tokens = await this.issueTokens(user.id);
    return { user: sanitize(user), ...tokens };
  }

  async refresh(refreshToken: string) {
    const session = await this.prisma.session.findUnique({ where: { refreshToken } });
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid refresh token");
    }
    return this.issueTokens(session.userId);
  }

  async logout(refreshToken: string) {
    await this.prisma.session.updateMany({
      where: { refreshToken },
      data: { revokedAt: new Date() },
    });
    return { ok: true };
  }

  // ---------------- helpers ----------------

  private async issueTokens(userId: string) {
    const accessToken = await this.jwt.signAsync(
      { sub: userId },
      {
        secret: this.config.get<string>("JWT_ACCESS_SECRET", "change-me"),
        expiresIn: this.config.get<string>("JWT_ACCESS_TTL", "15m"),
      },
    );
    const refreshToken = uuid() + uuid();
    const ttlDays = 30;
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
    await this.prisma.session.create({
      data: { userId, refreshToken, expiresAt },
    });
    return { accessToken, refreshToken };
  }

  private async linkReferralChain(parentL1Id: string, childId: string) {
    // L1
    await this.prisma.referral.create({
      data: { parentId: parentL1Id, childId, level: 1, rate: REF_RATES[1] },
    });
    // L2
    const parentL1 = await this.prisma.user.findUnique({ where: { id: parentL1Id } });
    if (parentL1?.referredById) {
      await this.prisma.referral.create({
        data: { parentId: parentL1.referredById, childId, level: 2, rate: REF_RATES[2] },
      });
      // L3
      const parentL2 = await this.prisma.user.findUnique({ where: { id: parentL1.referredById } });
      if (parentL2?.referredById) {
        await this.prisma.referral.create({
          data: { parentId: parentL2.referredById, childId, level: 3, rate: REF_RATES[3] },
        });
      }
    }
  }

  private async creditWelcomeBonus(userId: string) {
    await this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.update({
        where: { userId },
        data: { balance: { increment: WELCOME_BONUS }, totalEarned: { increment: WELCOME_BONUS } },
      });
      await tx.transaction.create({
        data: {
          userId,
          walletId: wallet.id,
          type: "WELCOME_BONUS",
          status: "COMPLETED",
          amount: WELCOME_BONUS,
          balanceAfter: wallet.balance,
          description: "Welcome bonus",
        },
      });
    });
  }
}

function generateRefCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

/** Normalize Pakistani phone numbers to E.164 ("+923XXxxxxxxx"). */
function normalizePkPhone(input: string) {
  const digits = input.replace(/\D/g, "");
  let local = "";
  if (digits.startsWith("92")) local = digits.slice(2);
  else if (digits.startsWith("0")) local = digits.slice(1);
  else local = digits;
  return "+92" + local;
}

function sanitize(user: any) {
  const { password, totpSecret, ...safe } = user;
  return safe;
}
