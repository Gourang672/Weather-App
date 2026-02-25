import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from '../../schemas/otp.schema';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const matched = await bcrypt.compare(password, (user as any).password as string);
    if (matched) {
      const { password: _p, ...result } = user.toObject ? user.toObject() : user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user._id, email: user.email, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async requestOtp(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return { ok: false };
      const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
    const saltRounds = 10;
    const codeHash = await bcrypt.hash(code, saltRounds);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.otpModel.create({ user: user._id, codeHash, expiresAt, used: false });

    // send the OTP email (do not return the code in production)
    try {
      await this.mailService.sendOtpEmail(user.email, code, 5);
    } catch (e) {
        console.error('Failed to send OTP email', e);
    }

    return { ok: true };
  }

  async verifyOtp(email: string, code: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const otp = await this.otpModel.findOne({ user: user._id, used: false }).sort({ createdAt: -1 }).exec();
    if (!otp) return null;
    if (otp.expiresAt < new Date()) return null;
    const matched = await bcrypt.compare(code, otp.codeHash);
    if (!matched) return null;
    otp.used = true;
    await otp.save();
    const { password: _p, ...result } = user.toObject ? user.toObject() : user;
    return result;
  }
}
