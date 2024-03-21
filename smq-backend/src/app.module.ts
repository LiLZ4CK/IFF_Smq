import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AppService } from './app.service';
import { AuthuserModule } from './authuser/authuser.module';
import { PrismaService } from './prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { MailerModule } from '@nestjs-modules/mailer';
import { SettingsModule } from './Settings/Settings.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { NavModule } from './Navigation/Nav.module';
import { AdminModule } from './Admin/Admin.module';
import { AuditsModule } from './Audits/Audits.module';
import { GEDModule } from './GED/GED.module';


@Module({
  imports: [PrismaModule, AuthuserModule, SettingsModule, NavModule, AdminModule, AuditsModule, GEDModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
