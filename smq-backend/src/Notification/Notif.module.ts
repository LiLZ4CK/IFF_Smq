import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotifController } from './Notif.controller';
import { NotifService } from './Notif.service';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer/dist';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
    imports: [
      PrismaModule,
        MailerModule.forRoot({
          transport: {
            service: 'gmail',
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASSWORD,
            },
          }
        }),
      ],
  controllers: [NotifController],
  providers: [NotifService, PrismaService],
  exports: [NotifService],
})
export class NotifModule {}