import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthuserController } from './authuser.controller';
import { AuthuserService } from './authuser.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService, } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt/dist';
import { MailerModule } from '@nestjs-modules/mailer/dist';
import { config } from 'process';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PrismaModule, JwtModule,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      }
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET, // Provide your secret key here
      signOptions: { expiresIn: '1d' }, // Set expiration time for the token
    }),
  ],
  controllers: [AuthuserController],
  providers: [AuthuserService, PrismaService, JwtService, ],
  exports: [AuthuserService],
})
export class AuthuserModule {}