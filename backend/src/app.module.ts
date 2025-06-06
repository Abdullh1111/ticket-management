import { Module } from '@nestjs/common';
import { AuthModule } from './auth/src/auth.module';
import { PrismaModule } from './libs/prisma/prisma.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [AuthModule, PrismaModule, TicketsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
