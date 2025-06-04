import { Module } from '@nestjs/common';
import { AuthModule } from './auth/src/auth.module';
import { PrismaModule } from './libs/prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
