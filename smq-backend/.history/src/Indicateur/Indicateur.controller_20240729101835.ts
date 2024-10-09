import { Body, Controller, Get, Post, Res, Redirect, Param, UseGuards, Delete, Req } from '@nestjs/common';
import { IndicateurService } from './Indicateur.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt';
import { auditTime, retry } from 'rxjs';
import { time } from 'console';
import * as moment from 'moment';
import { start } from 'repl';


@Controller('/indic')
export class IndicateurController{

    @Post('/new')
    
    @UseGuards(AuthGuard)
    async newindc(){}
}