import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SettingsController } from './Settings.controller';
import { SettingsService } from './Settings.service';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [ JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  }),],
  controllers: [SettingsController],
  providers: [SettingsService, PrismaService],
  exports: [SettingsService],
})
export class SettingsModule {}