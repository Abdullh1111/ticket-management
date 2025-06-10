import { Module } from '@nestjs/common';
import { AuthModule } from './auth/src/auth.module';
import { PrismaModule } from './libs/prisma/prisma.module';
import { TicketsModule } from './tickets/tickets.module';
import { ChatGateway } from './chat/chat.gateway';
import { ChatsModule } from './chats/chats.module';
import { ChatsService } from './chats/chats.service';

@Module({
  imports: [AuthModule, PrismaModule, TicketsModule, ChatsModule],
  controllers: [],
  providers: [ChatGateway, ChatsService],
})
export class AppModule {}
