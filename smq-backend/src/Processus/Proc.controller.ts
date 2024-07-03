import { Body, Controller, Get, Post, Res, Redirect, Param, UseGuards, Delete, Req } from '@nestjs/common';
import { ProcService } from './Proc.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt';
import { auditTime, retry } from 'rxjs';
import { time } from 'console';
import * as moment from 'moment';
import { start } from 'repl';


@Controller('/proc')
export class ProcController{
	constructor(private readonly procService: ProcService,
				private prisma: PrismaService,
                private jwtService: JwtService) {}

        
            @Get('/list')
            async getall(@Res() res: Response){
                const procs = await this.prisma.processus.findMany({orderBy:{id: 'asc'}})
                return res.status(HttpStatus.OK).send({procs});
            }

            @Post('/descri')
            async getdesc(@Res() res: Response, @Body('descri') descri: number){
                const desc = await this.prisma.pdescription.findUnique({where:{processusId: descri}})
                if (desc)
                {
                    console.log('yessss');
                }
                return res.status(HttpStatus.OK).send({desc});
            }
            

            @Post('/newproc')
            async createNew(@Res() res: Response, ){

                try{
                    //const userr = await this.prisma.user.findUnique({where:{name: uname}})
                //if(!userr){
                    //user not found!
                //}
                const count = await this.prisma.processus.count()
                //const newCode = `AUD-${moment().year()}-${String(count + 1).padStart(4, '0')}`;
                await this.prisma.processus.create({data:{
                  name: 'name '+count,
                  type: 'type '+count,
                  responsableId: 1,
                  element: 'element '+ count,
                  pilot: 'pilot '+count,
                  finalite:'finalite '+count,
                  indicateurEobject: 'indc '+count,}} )
                  return res.status(HttpStatus.OK).send('okk')
                }
                catch(error){
                    console.log(error)
                }
            }

            @Post('/delete')
            async deleteaudit(@Res() res:Response, @Req() req:Request, @Body('idd') deleted: number){
                await this.prisma.audit.delete({where:{id: deleted}})
                return res.status(HttpStatus.OK).send('okk')
            }
            
            @Post('/edit')
            async editaudit(@Res() res:Response, @Req() req:Request, @Body('aud') aud:any){
                await this.prisma.audit.update({where:{id: aud.iddd},
                data:{
                    processus: aud.proce,
                    planningDate: aud.start,
                    realisationDate: aud.end,
                }})
                return res.status(HttpStatus.OK).send('okk')
            }
    }