import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuditsController } from './Audits.controller';
import { AuditsService } from './Audits.service';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [ JwtModule.register({
    secretOrPrivateKey: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  }),],
  controllers: [AuditsController],
  providers: [AuditsService, PrismaService],
  exports: [AuditsService],
})
export class AuditsModule {}