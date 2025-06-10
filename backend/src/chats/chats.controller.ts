import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get(":userid")
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req, @Param('userid') userid: string) {
    console.log(userid)
    const userId = userid === "null" ? req.user.id : userid
    console.log(userId)
    return this.chatsService.findAll(userId);
  }
}
