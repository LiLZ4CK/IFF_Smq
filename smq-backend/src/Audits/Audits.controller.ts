import { Body, Controller, Get, Post, Res, Redirect, Param, UseGuards } from '@nestjs/common';
import { AuditsService } from './Audits.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt';
import { retry } from 'rxjs';

@Controller('/audits')
export class AuditsController{
	constructor(private readonly adminService: AuditsService,
				private prisma: PrismaService,
                private jwtService: JwtService) {}

        
            @Get('/list')
            async getall(@Res() res: Response){
                const audits = await this.prisma.audit.findMany({orderBy:{id: 'asc'}})
                return res.status(HttpStatus.OK).send({audits});
            }

    }