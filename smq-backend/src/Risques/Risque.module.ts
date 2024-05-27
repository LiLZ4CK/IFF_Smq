import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RisqueController } from './Risque.controller';
import { RisqueService } from './Risque.service';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [ JwtModule.register({
    secretOrPrivateKey: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  }),],
  controllers: [RisqueController],
  providers: [RisqueService, PrismaService],
  exports: [RisqueService],
})
export class RisqueModule {}