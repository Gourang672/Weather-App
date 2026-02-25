import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

class SendOtpDto {
  email: string;
  otp: string;
  expiryMinutes?: number;
}

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-otp')
  async sendOtp(@Body() body: SendOtpDto) {
    return this.mailService.sendOtpEmail(body.email, body.otp, body.expiryMinutes);
  }
}
