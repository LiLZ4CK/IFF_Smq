import { Body, Controller, UseGuards, Get, HttpStatus, Post, Res, Req } from '@nestjs/common';
import { STATUS_CODES } from 'http';
import { NotifService } from './Notif.service'
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs-extra';
import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards'
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../authuser/jwt.guard';
import * as moment from 'moment';




@Controller('/notif')
export class NotifController { 
    constructor(private readonly authuserService: NotifService,
        private prisma: PrismaService,
        private jwtService: JwtService) {}

        @Get('soon')
        @UseGuards(AuthGuard)
        async newnotif(@Req() req:Request, @Res() res:Response){
            const user = await this.prisma.user.findUnique({where: {email:  req['user'].email}})
		    if(!user)
		    {
		    	return res.status(HttpStatus.NOT_FOUND).send('no');
		    }
            const audits = await this.prisma.audit.findMany({where:{status: 0},orderBy:{planningDate: 'asc'}})
            const today = moment();
            const soonAudits: any[] = [];
            for (let i = 0; audits[i]; i++){
                const daysDifference = Math.abs(today.diff(audits[i].planningDate, 'days'));
                if(daysDifference > 0 && daysDifference < 5){
                    soonAudits.push(audits[i]);
            }
        }  
            let num = soonAudits.length
            console.log('aa')
            return res.status(HttpStatus.OK).send({num, soonAudits}); 
        
        
        
        }
}