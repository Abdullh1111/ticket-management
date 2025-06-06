import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { PrismaModule } from 'src/libs/prisma/prisma.module';
import { CloudinaryModule } from 'src/libs/cloudinary/src';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
