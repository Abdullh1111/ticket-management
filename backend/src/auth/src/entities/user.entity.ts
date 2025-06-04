import { Role } from '@prisma/client';

export class UserEntity {
  id: string;

  email: string;

  password: string;

  expiresAt?: Date;

  otp?: string;

  role: Role;

  createdAt: Date;

  updatedAt: Date;

  verified: boolean;

  verificationToken?: string;
}
