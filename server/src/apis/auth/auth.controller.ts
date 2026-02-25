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
    // With stateless JWT, instruct client to discard token. Server-side invalidation
    // (blacklist) is out of scope for this simple implementation.
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
}
