import { Body, Controller, Get, Post, Res, Redirect, Query, Param, UseGuards, Delete, Req } from '@nestjs/common';
import { AuditsService } from './Audits.service';
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
import { readFile } from 'fs/promises';


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

            @Post('/new')
            @UseGuards(AuthGuard)
            async createNew(@Res() res: Response, 
            @Req() req: Request,
            @Body('aud') aud: any,){

                try{
                    const userr = await this.prisma.user.findUnique({where:{email: req['user'].email}})
                    console.log('here!')
                    if(!userr){
                        //user not found!
                    }
                    const count = await this.prisma.audit.count()
                    const newCode = `AUD-${moment().year()}-${String(count + 1).padStart(4, '0')}`;
                    const auditt = await this.prisma.audit.create({data:{
                      type: aud.type,
                      code: newCode,
                      responsableId: userr.id,
                      processus: aud.proc,
                      planningDate: new Date(aud.start),
                      realisationDate: new  Date(aud.end),
                      lieu: 'IFF',}} )
                    }
                    catch(error){
                        console.log(error)
                    }
                return res.status(HttpStatus.OK).send('okk')
            }

            @Post('/delete')
            async deleteaudit(@Res() res:Response, @Req() req:Request, @Body('idd') deleted: number){
                await this.prisma.audit.delete({where:{id: deleted}})
                return res.status(HttpStatus.OK).send('okk')
            }

            @Get('/one')
            async getone(@Query('id') id: string, @Res() res: Response) {
                console.log('id== ', id)
              try {
                const auditId = parseInt(id, 10);
                if (isNaN(auditId)) {
                  return res.status(HttpStatus.BAD_REQUEST).send('Invalid ID');
                }
          
                const audit = await this.prisma.audit.findUnique({
                  where: {
                    id: auditId,
                  },
                });
          
                if (audit) {
                  return res.status(HttpStatus.OK).send({audits});;
                } else {
                  return res.status(HttpStatus.NOT_FOUND).send('Audit not found');
                }
              } catch (error) {
                console.error('Error fetching audit:', error);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error fetching audit');
              }
            }

            
            @Post('/edit')
            async editaudit(@Res() res:Response, @Req() req:Request, @Body('auda') auda:any){
                try{
                    ;
                    const audit1 = await this.prisma.audit.findUnique({where:{id: auda.id}})
                    const start = new Date(auda.mvstart)
                    const end = new Date(auda.mvend)
                    console.log('plan: ', audit1.planningDate, ' mv: ', auda.mvstart, ' reali: ', audit1.realisationDate, ' mv: ', auda.mvend)
                    if ((audit1.planningDate.getTime() !== start.getTime()) || (audit1.realisationDate.getTime() !== end.getTime())) {
                        await this.prisma.audit.update({
                            where: { id: auda.id },
                            data: {
                                planningDate: start,
                                realisationDate: end,
                            },
                        });
                        console.log(1);
                    } else {
                        console.log(2);
                    
                        const updateData = {
                            type: auda.type !== undefined && auda.type !== null ? auda.type : undefined,
                            processus: auda.proce !== undefined && auda.proce !== null ? auda.proce : undefined,
                            planningDate: auda.start !== undefined && auda.start !== null ? new Date(auda.start) : undefined,
                            realisationDate: auda.end !== undefined && auda.end !== null ? new Date(auda.end) : undefined,
                            status: auda.status !== undefined && auda.status !== null ? auda.status : undefined
                        };
                    
                        // Remove undefined values from the updateData object
                        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
                    
                        await this.prisma.audit.update({
                            where: { id: auda.id },
                            data: updateData,
                        });
                    }
            }catch(error){
                console.log('error: ', error)
            }
                return res.status(HttpStatus.OK).send('okk')
            }

            @Post('openpdf')
            async openpdf(@Body('pdff') pdff: string, @Res() res: Response) {
              try {
                console.log('path:', pdff)
                const pdfData = await readFile(pdff); // Read the PDF file (adjust this based on your file storage)

                res.set('Content-Type', 'application/pdf');
                res.send(pdfData);
              } catch (error) {
                console.error('Error fetching PDF:', error);
                res.status(404).send('PDF not found');
              }
            }
    }