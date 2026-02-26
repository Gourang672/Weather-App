import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as Handlebars from 'handlebars';
import { promises as fs } from 'fs';
import * as path from 'path';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);
  private templateCache = new Map<string, Handlebars.TemplateDelegate>();

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const port = this.configService.get<number>('SMTP_PORT');
    if (!port) throw new Error('SMTP_PORT not configured');

    const nodemailerConfig: any = {
      host: this.configService.get<string>('SMTP_HOST'),
      port: port,
      secure: port === 465,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
      timeout: this.configService.get<number>('SMTP_TIMEOUT'),
    };

    this.transporter = nodemailer.createTransport(nodemailerConfig);

    this.transporter
      .verify()
      .then(() => {
        this.logger.log('✅ Email transporter is ready');
      })
      .catch((err) => {
        this.logger.warn('⚠️ Email transporter connection warning (emails may not work): ' + err.message);
      });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: options.from || this.configService.get<string>('SMTP_FROM'),
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.toText(options.html || ''),
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully: ${info.messageId}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Failed to send email to ${options.to}:`, error.message);
      throw error;
    }
  }

  async sendOtpEmail(email: string, otp: string, expiryMinutes: number = 10): Promise<boolean> {
    const subject = 'Your OTP for Login';
    const html = await this.renderTemplate('otp', {
      title: 'Login Verification',
      otp,
      expiryMinutes,
    });

    return this.sendEmail({ to: email, subject, html });
  }

  // MailService exposes `sendOtpEmail` for OTP delivery; no CRUD required.

  private getTemplatesDir() {
    return path.resolve(__dirname, './templates');
  }

  private async getCompiledTemplate(name: string): Promise<Handlebars.TemplateDelegate> {
    if (this.templateCache.has(name)) {
      return this.templateCache.get(name) as Handlebars.TemplateDelegate;
    }
    const filePath = path.join(this.getTemplatesDir(), `${name}.hbs`);
    const source = await fs.readFile(filePath, 'utf8');
    const template = Handlebars.compile(source, { noEscape: true });
    this.templateCache.set(name, template);
    return template;
  }

  private async renderTemplate(name: string, context: Record<string, any>): Promise<string> {
    const layoutPath = path.join(this.getTemplatesDir(), 'layouts', 'main.hbs');
    let layout = '';
    try {
      layout = await fs.readFile(layoutPath, 'utf8');
    } catch (e) {
      this.logger.debug(`Email layout not found at ${layoutPath}, rendering without layout.`);
    }

    const template = await this.getCompiledTemplate(name);
    const baseContext = {
      year: new Date().getFullYear(),
      appName: this.configService.get<string>('APP_NAME'),
    };
    const data = { ...baseContext, ...context };
    const body = template(data);

    if (!layout) return body;

    const layoutTpl = Handlebars.compile(layout, { noEscape: true });
    return layoutTpl({ ...data, body });
  }

  private toText(html: string): string {
    return html
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
