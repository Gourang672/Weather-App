import { Controller, Post, Body, Res, HttpCode, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

class LoginDto {
  email: string;
  password: string;
}

class OtpRequestDto {
  email: string;
}

class OtpVerifyDto {
  email: string;
  code: string;
}

class PasswordResetRequestDto {
  email: string;
}

class PasswordResetVerifyDto {
  email: string;
  code: string;
}

class PasswordResetDto {
  email: string;
  newPassword: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return this.authService.requestOtp(body.email);
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Res() res: any) {
    return res.json({ ok: true });
  }

  @HttpCode(200)
  @Post('request-otp')
  async requestOtp(@Body() body: OtpRequestDto) {
    return this.authService.requestOtp(body.email);
  }

  @HttpCode(200)
  @Post('verify-otp')
  async verifyOtp(@Body() body: OtpVerifyDto) {
    const user = await this.authService.verifyOtp(body.email, body.code);
    if (!user) throw new UnauthorizedException('Invalid or expired OTP');
    return this.authService.login(user);
  }

  @HttpCode(200)
  @Post('request-password-reset')
  async requestPasswordReset(@Body() body: PasswordResetRequestDto) {
    return this.authService.requestPasswordReset(body.email);
  }

  @HttpCode(200)
  @Post('verify-password-reset-otp')
  async verifyPasswordResetOtp(@Body() body: PasswordResetVerifyDto) {
    const result = await this.authService.verifyPasswordResetOtp(body.email, body.code);
    if (!result) throw new UnauthorizedException('Invalid or expired OTP');
    return { ok: true };
  }

  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(@Body() body: PasswordResetDto) {
    const result = await this.authService.resetPassword(body.email, body.newPassword);
    if (!result.ok) throw new UnauthorizedException(result.message);
    return result;
  }
}
