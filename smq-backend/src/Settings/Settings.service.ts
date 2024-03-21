import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt/dist';
import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service';



@Injectable()
export class SettingsService{
    constructor(private prisma: PrismaService,) {}

}