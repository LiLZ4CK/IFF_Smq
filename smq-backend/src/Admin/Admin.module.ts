import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminController } from './Admin.controller';
import { AdminService } from './Admin.service';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [ JwtModule.register({
    secretOrPrivateKey: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  }),],
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
  exports: [AdminService],
})
export class AdminModule {}