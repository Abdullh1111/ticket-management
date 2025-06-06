import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth-guard';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { PasswordResetDto } from './dto/password-reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({passthrough: true}) res) {
    const data = await this.authService.login(loginDto);
    res.cookie('accessToken', data.accessToken,{
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return data;
  }

  @Post('resend-verification')
  async resendVerificationEmail(@Body('email') email: string) {
    return this.authService.resendVerificationEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('forget-password')
  async forgetPassword(@Body('email') email: string) {
    return this.authService.initiatePasswordReset(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() passwordResetDto: PasswordResetDto) {
    return this.authService.resetPassword(passwordResetDto);
  }

  @Post('logout')
  async logout(@Res({passthrough: true}) res) {
    res.clearCookie('accessToken');
    return {
      message: 'Logout successful',
    };
  }
}
