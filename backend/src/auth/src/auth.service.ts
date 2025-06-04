import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EmailService } from '../../services/email.service';
import {
  LoginResponseEntity,
  VerificationEntity,
  PasswordResetEntity,
} from './entities/auth.entity';
import { UserEntity } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/libs/prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserEntity> {
    const { email, password, fullName } = registerDto;

    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      // Generate email verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user with profile and verification token
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          verified: false,
          verificationToken,
          profile: {
            create: {
              fullName,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      // Send verification email
      await this.sendVerificationEmail(email, verificationToken);

      // Convert to UserEntity
      return {
        id: user.id,
        email: user.email,
        password: user.password,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        verified: user.verified,
        verificationToken: user.verificationToken,
      };
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`);
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponseEntity> {
    const { email, password } = loginDto;

    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if user is verified
      if (!user.verified) {
        throw new UnauthorizedException('Please verify your email first');
      }

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`);
      throw error;
    }
  }

  async verifyEmail(verifyDto: VerifyEmailDto): Promise<VerificationEntity> {
    const { token } = verifyDto;

    try {
      const user = await this.prisma.user.findUnique({
        where: { verificationToken: token },
      });

      if (!user) {
        throw new BadRequestException('Invalid verification token');
      }

      // Check if token has expired
      if (
        user.verificationTokenExpiry &&
        user.verificationTokenExpiry < new Date()
      ) {
        throw new BadRequestException(
          'Verification token has expired. Please request a new one.',
        );
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          verified: true,
          verificationToken: null,
          verificationTokenExpiry: null,
        },
      });

      return {
        token,
        expiresAt: user.verificationTokenExpiry || new Date(),
        isVerified: true,
      };
    } catch (error) {
      this.logger.error(`Email verification error: ${error.message}`);
      throw error;
    }
  }

  async initiatePasswordReset(email: string): Promise<PasswordResetEntity> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Generate password reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Save reset token
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      // Send password reset email
      await this.emailService.sendPasswordResetEmail(email, resetToken);

      return {
        resetToken,
        expiresAt: resetTokenExpiry,
        email: user.email,
      };
    } catch (error) {
      this.logger.error(`Password reset initiation error: ${error.message}`);
      throw error;
    }
  }

  async resetPassword(resetDto: PasswordResetDto): Promise<boolean> {
    const { token, newPassword, newEmail } = resetDto;

    try {
      // Find user with valid reset token
      const user = await this.prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: { gt: new Date() },
        },
      });

      if (!user) {
        throw new BadRequestException('Invalid or expired reset token');
      }

      let hashedPassword;
      // Hash new password
      if (newPassword) {
        hashedPassword = await bcrypt.hash(newPassword, 10);
      }

      // Update password and clear reset token
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          email: newEmail || user.email,
          password: hashedPassword || user.password,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      return true;
    } catch (error) {
      this.logger.error(`Password reset error: ${error.message}`);
      throw error;
    }
  }

  async resendVerificationEmail(email: string): Promise<void> {
    try {
      if (!email) {
        throw new BadRequestException('Email must be provided');
      }

      const user = await this.prisma.user.findUnique({
        where: { email: email.trim() },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.verified) {
        throw new BadRequestException('User is already verified');
      }

      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Update user with new token and increment resend count
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          verificationToken,
          verificationTokenExpiry: verificationExpiry,
        },
      });

      await this.sendVerificationEmail(email, verificationToken);
    } catch (error) {
      this.logger.error(
        `Failed to resend verification email: ${error.message}`,
      );
      throw error;
    }
  }

  // Add a method to reset verification attempts

  private async sendVerificationEmail(
    email: string,
    token: string,
  ): Promise<void> {
    await this.emailService.sendVerificationEmail(email, token);
  }

  private generateAccessToken(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: '1D',
    });
  }

  private generateRefreshToken(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }
}
