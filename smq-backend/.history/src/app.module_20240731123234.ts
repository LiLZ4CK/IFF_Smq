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
import { ActionsModule } from './Actions/Actions.module';
import { GEDModule } from './GED/GED.module';
import { NotifModule } from './Notification/Notif.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RisqueModule } from './Risques/Risque.module'
import { ProcModule } from './Processus/Proc.module'
import { NocModule } from './NC/Noc.module'
import {FichierModule } from './Fichier/Fichier.Module'
import {IndicateurModule } from './Fichier/Fichier.Module'

@Module({
  imports: [
    ScheduleModule.forRoot(),PrismaModule, AuthuserModule,
    SettingsModule, NavModule, AdminModule, AuditsModule,
    GEDModule, ActionsModule,NotifModule, ProcModule,
    RisqueModule, NocModule, FichierModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
