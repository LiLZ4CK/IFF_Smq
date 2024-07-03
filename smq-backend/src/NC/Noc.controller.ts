import { Body, Controller, Get, Post, Res, Redirect, Param, UseGuards, Delete, Req } from '@nestjs/common';
import { NocService } from './Noc.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt';
import { audit, auditTime, retry } from 'rxjs';
import { time } from 'console';
import * as moment from 'moment';
import { start } from 'repl';
import { AuthGuard } from 'src/authuser/jwt.guard';


@Controller('/nconf')
export class NocController{
	constructor(private readonly nocService: NocService,
				private prisma: PrismaService,
                private jwtService: JwtService) {}

        
            @Get('/list')
            async getall(@Res() res: Response){
                const nconf = await this.prisma.nconform.findMany({orderBy:{id: 'asc'}})
                return res.status(HttpStatus.OK).send({nconf});
            }

            

            @Post('/new')
            @UseGuards(AuthGuard)
            async createNew(@Res() res: Response, 
            @Req() req: Request,
            @Body('conf') noco: any,){

                try{
                    const userr = await this.prisma.user.findUnique({where:{email: req['user'].email}})
                    console.log('hera!')
                    if(!userr){
                        //user not found!
                    }
                    const auditt = await this.prisma.nconform.create({data:{
                            responsables: noco.resp,
                            processus: noco.proce,
                            constats: noco.const,
                            origine: noco.orig,
                            constatdate: new Date(noco.condate),
                            acorrective: noco.acorr,
                            refqualite: noco.refqu,
                            type: noco.type,
                            aimmediates: noco.aimm,

                    }} )
                    }
                    catch(error){
                        console.log(error)
                    }
                    console.log('ok!!')
                return res.status(HttpStatus.OK).send('okk')
            }

            @Post('/delete')
            async deleteaudit(@Res() res:Response, @Req() req:Request, @Body('idd') deleted: number){
                await this.prisma.nconform.delete({where:{id: deleted}})
                return res.status(HttpStatus.OK).send('okk')
            }

            @Get('/resp')
            async getResp(@Res() res:Response, @Req() req:Request){
                const resp = await this.prisma.user.findMany();
                return res.status(HttpStatus.OK).send({resp});
            }
            
    }
