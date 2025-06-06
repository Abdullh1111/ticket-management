import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Category, Priority } from '@prisma/client';


export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Category)
  category: Category;

  @IsEnum(Priority)
  priority: Priority;

  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCommentDto)
  comments?: CreateCommentDto[];
}
