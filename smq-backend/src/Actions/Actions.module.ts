import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActionsController } from './Actions.controller';
import { ActionsService } from './Actions.service';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [ JwtModule.register({
    secretOrPrivateKey: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  }),],
  controllers: [ActionsController],
  providers: [ActionsService, PrismaService],
  exports: [ActionsService],
})
export class ActionsModule {}