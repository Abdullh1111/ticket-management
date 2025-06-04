import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { VerificationEmail } from './emailTemplate';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    try {
      // Log configuration details (without TicketManagementtive info)
      this.logger.log(
        `Configuring SMTP with host: ${this.configService.get('SMTP_HOST')}`,
      );
      this.logger.log(`SMTP Port: ${this.configService.get('SMTP_PORT')}`);
      this.logger.log(`SMTP Secure: ${this.configService.get('SMTP_SECURE')}`);

      this.transporter = nodemailer.createTransport({
        host: this.configService.get('SMTP_HOST'),
        port: parseInt(this.configService.get('SMTP_PORT') || '587'),
        secure: this.configService.get('SMTP_SECURE') === 'true',
        auth: {
          user: this.configService.get('SMTP_USER'),
          pass: this.configService.get('SMTP_PASS'),
        },

        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 5000,
      });

      // Verify transporter connection
      this.transporter.verify((error) => {
        if (error) {
          this.logger.error('SMTP Connection Verification Failed', error);
        } else {
          this.logger.log('SMTP Connection Verified Successfully');
        }
      });
    } catch (error) {
      this.logger.error('Failed to configure email transporter', error);
      throw new Error('Email service configuration failed');
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    try {
      const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}&email=${email}`;

      const mailOptions = {
        from:
          this.configService.get('EMAIL_FROM') ||
          '"TicketManagement" <noreply@TicketManagement.net>',
        to: email,
        subject: 'Verify Your Email',
        html: VerificationEmail(verificationUrl),
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Verification email sent to ${email}. Message ID: ${info.messageId}`,
      );
      return info;
    } catch (error) {
      this.logger.error(`Detailed email sending error for ${email}:`, error);
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    try {
      const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}&email=${email}`;

      const mailOptions = {
        from:
          this.configService.get('EMAIL_FROM') ||
          '"TicketManagement" <noreply@TicketManagement.net>',
        to: email,
        subject: 'Password Reset Request',
        html: `
          <h1>Password Reset</h1>
          <p>You have requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>If you did not request this reset, please ignore this email.</p>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Password reset email sent to ${email}. Message ID: ${info.messageId}`,
      );
      return info;
    } catch (error) {
      this.logger.error(
        `Detailed password reset email error for ${email}:`,
        error,
      );
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }
}
