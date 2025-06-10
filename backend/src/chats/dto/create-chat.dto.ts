import { Role } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';


export class CreateChatDto {
  @IsEnum(Role)
  sender: Role;

  @IsString()
  content: string;

  @IsString()
  receiverId: string;

  @IsString()
  senderId: string;
}
