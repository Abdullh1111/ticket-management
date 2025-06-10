import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/libs/prisma/prisma.service';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createChatDto: CreateChatDto) {
    try {
      return await this.prisma.chat.create({
        data: createChatDto,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(userId: string) {
    try {
      const chatHistory = await this.prisma.chat.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId },
          ]
        }
      })
      if(!chatHistory) return [];
      return chatHistory;
    } catch (error) {
      throw new Error(error);
    }
  }
}
