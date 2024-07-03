import { Body, Controller, Get, Post, Res, Req, Param, UseGuards } from '@nestjs/common';
import { ActionsService } from './Actions.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/authuser/jwt.guard';
import { auditTime, retry } from 'rxjs';
import { time } from 'console';
import * as moment from 'moment';


@Controller('/Actions')
export class ActionsController{
	constructor(private readonly actionsService: ActionsService,
				private prisma: PrismaService,
                private jwtService: JwtService) {}

        
            @Get('/list')
            async getall(@Res() res: Response){
                const actions = await this.prisma.action.findMany({orderBy:{id: 'asc'}})
                return res.status(HttpStatus.OK).send({actions});
            }

            @Post('/newActions')
            @UseGuards(AuthGuard)
            async createNew(@Req() req: Request,@Res() res: Response, 
            @Body('Type') typee: string,
            @Body('Echeance') eche: string,
            @Body('Priorite') prio: string,
            @Body('Libelle') libel: string,
            @Body('Status') stat: string,
            @Body('Couts') couts: string,){
                console.log('here!')
                try{
                    const userr = await this.prisma.user.findUnique({where: {email:  req['user'].email}})
                if(!userr){
                    //user not found!
                }
                const count = await this.prisma.action.count()
                const newCode = `ACT-${moment().year()}-${String(count + 1).padStart(4, '0')}`;
                const auditt = await this.prisma.action.create({data:{
                  responsableId: userr.id,
                  code: newCode,
                  priorite: prio,
                  libelle: libel,
                  type: typee,
                  echeance: eche,
                  status: stat,
                  cout:  parseInt(couts, 10)
                }} )
                  return res.status(HttpStatus.OK).send('okk')
                }
                catch(error){
                    console.log(error)
                }
            }

    }