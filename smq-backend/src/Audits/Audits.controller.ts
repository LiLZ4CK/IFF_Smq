import { Body, Controller, Get, Post, Res, Redirect, Param, UseGuards, Delete, Req } from '@nestjs/common';
import { AuditsService } from './Audits.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt';
import { auditTime, retry } from 'rxjs';
import { time } from 'console';
import * as moment from 'moment';
import { start } from 'repl';


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

            @Post('/newAudit')
            async createNew(@Res() res: Response, 
            @Body('User') uname: string,
            @Body('Type') typee: string,
            @Body('Processus') procs: string,
            @Body('Description') desc: string,){

                try{
                    const userr = await this.prisma.user.findUnique({where:{name: uname}})
                if(!userr){
                    //user not found!
                }
                const count = await this.prisma.audit.count()
                const newCode = `AUD-${moment().year()}-${String(count + 1).padStart(4, '0')}`;
                const auditt = await this.prisma.audit.create({data:{
                  type: typee,
                  code: newCode,
                  responsableId: userr.id,
                  processus: procs,
                  description: desc,
                  lieu: 'IFF',}} )
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