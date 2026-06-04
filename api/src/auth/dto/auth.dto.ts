import { Type } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from "class-validator";
import { Gender } from "@prisma/client";

/**
 * Loose Pakistan phone match — accepts:
 *   03XX XXXXXXX  (11 digits)
 *   +92 3XX XXXXXXX
 *   0092 3XX XXXXXXX
 * Spaces, dashes, and parentheses are allowed in input.
 */
const PK_PHONE = /^(?:\+?92|0)?[\s-]?3\d{2}[\s-]?\d{7}$/;

export class SignupDto {
  @IsString() @MinLength(2)
  fullName!: string;

  @IsString() @Matches(/^[a-z0-9_]{3,20}$/i, { message: "Username 3-20 chars: letters, numbers, underscore." })
  username!: string;

  @IsEnum(Gender, { message: "Gender 'MALE' ya 'FEMALE' hona chahiye." })
  gender!: Gender;

  @IsString() @MinLength(2)
  city!: string;

  @IsString() @Matches(PK_PHONE, { message: "Sirf Pakistani number qabool hai." })
  phone!: string;

  @IsOptional() @IsEmail()
  email?: string;

  @IsString() @MinLength(6)
  password!: string;

  @IsOptional() @IsString()
  referralCode?: string;
}

export class LoginDto {
  // Accept either username or email. We disambiguate in the service.
  @IsString() @MinLength(3)
  identifier!: string;

  @IsString() @MinLength(6)
  password!: string;
}

export class OtpVerifyDto {
  @IsString() @MinLength(6)
  code!: string;
}

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}

export class ForgotPasswordDto {
  @IsString() @MinLength(3)
  identifier!: string;
}

export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString() @MinLength(6)
  newPassword!: string;
}
