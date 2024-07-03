import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FichierController } from './Fichier.controller';
import { FichierService } from './Fichier.service';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [ JwtModule.register({
    secretOrPrivateKey: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  }),],
  controllers: [FichierController],
  providers: [FichierService, PrismaService],
  exports: [FichierService],
})
export class FichierModule {}