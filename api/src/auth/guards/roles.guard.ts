import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

export const ROLES_KEY = "roles";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required?.length) return true;

    const req = ctx.switchToHttp().getRequest();
    if (!req.user?.id) throw new ForbiddenException();
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true, status: true },
    });
    if (!user || user.status !== "ACTIVE") throw new ForbiddenException();
    if (!required.includes(user.role)) throw new ForbiddenException();
    return true;
  }
}
