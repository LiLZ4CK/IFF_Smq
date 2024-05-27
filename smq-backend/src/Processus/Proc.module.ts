import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProcController } from './Proc.controller';
import { ProcService } from './Proc.service';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [ JwtModule.register({
    secretOrPrivateKey: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  }),],
  controllers: [ProcController],
  providers: [ProcService, PrismaService],
  exports: [ProcService],
})
export class ProcModule {}