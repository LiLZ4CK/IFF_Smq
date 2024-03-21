import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NavController } from './Nav.controller';
import { NavService } from './Nav.service';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [ JwtModule.register({
    secretOrPrivateKey: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  }),],
  controllers: [NavController],
  providers: [NavService, PrismaService],
  exports: [NavService],
})
export class NavModule {}