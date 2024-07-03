import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NocController } from './Noc.controller';
import { NocService } from './Noc.service';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [ JwtModule.register({
    secretOrPrivateKey: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  }),],
  controllers: [NocController],
  providers: [NocService, PrismaService],
  exports: [NocService],
})
export class  NocModule {}