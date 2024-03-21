import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GEDController } from './GED.controller';
import { GEDService } from './GED.service';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [],
  controllers: [GEDController],
  providers: [GEDService, PrismaService],
  exports: [GEDService],
})
export class GEDModule {}