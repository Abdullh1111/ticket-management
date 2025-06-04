export class LoginResponseEntity {
  accessToken: string;

  refreshToken: string;

  user: {
    id: string;
    email: string;
    role: string;
    userImage?: string;
    userContactNumber?: string;
  };
}

export class VerificationEntity {
  token: string;

  expiresAt: Date;
  isVerified: boolean;

  alreadyVerified?: boolean;
}

export class PasswordResetEntity {
  resetToken: string;

  expiresAt: Date;

  email: string;
}
