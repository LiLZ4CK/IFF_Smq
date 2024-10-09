import { Body, Controller, Get, Post, Res, Redirect, Param, UseGuards, Delete, Req } from '@nestjs/common';
import { IndicateurService } from './Indicateur.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/authuser/jwt.guard';
import { auditTime, retry } from 'rxjs';
import { time } from 'console';
import * as moment from 'moment';
import { start } from 'repl';


@Controller('/indic')
export class IndicateurController{
    constructor(private readonly indicateurService: IndicateurService,
        private prisma: PrismaService,
        private jwtService: JwtService){}


    @Post('/new')
    @UseGuards(AuthGuard)
    async newindc(@Res() res, @Req() req,  @Body('indc') ind: any ){

        try {
            const userr = await this.prisma.user.findUnique({where:{email: req['user'].email}})
            const newInd = await this.prisma.indicateur.create({data:{
                processus: ind.proc,
                typeConstat: ind.tyc,
                origine: ind.orig,
                date: new Date (ind.date),
                constat: ind.const,
                analyse: ind.anal,
                typeAction: ind.typeact,
                Action: ind.ac
                responsableId: ind.
                delaiTrait: ind.
                suivi: ind.
                actionEfficace: ind.
                criteresDeval: ind.
                dateEvaluation: ind.
                observation: ind.

            }})
        }
        catch(error){
            console.error('error: ', error);
        }
    }
}