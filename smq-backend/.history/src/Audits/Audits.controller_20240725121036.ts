import { Body, Controller, Get, Post, Res, Redirect, Query, Param, UploadedFile, UseGuards, Delete,  Req,UseInterceptors } from '@nestjs/common';
import { AuditsService } from './Audits.service';
import { FileInterceptor } from '@nestjs/platform-express';
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
import * as fs from 'fs';
import * as multer from 'multer';


@Controller('/audits')
export class AuditsController{
	constructor(private readonly adminService: AuditsService,
				private prisma: PrismaService,
                private jwtService: JwtService) {}

        
                @Get('/list')
                async getall(@Res() res: Response) {
                  try {
                    const audits = await this.prisma.audit.findMany({ orderBy: { id: 'asc' } });
                
                    // Get the current date and time
                    const now = new Date();
                
                    // Filter audits that need to be updated
                    const auditsToUpdate = audits.filter(audit => 
                      audit.status === 0 && new Date(audit.realisationDate) < now
                    );
                
                    // Update each audit that meets the condition
                    const updatePromises = auditsToUpdate.map(audit =>
                      this.prisma.audit.update({
                        where: { id: audit.id },
                        data: { status: 1 }
                      })
                    );
                
                    // Await all update promises
                    await Promise.all(updatePromises);
                
                    // Fetch the updated list of audits
                    const updatedAudits = await this.prisma.audit.findMany({ orderBy: { id: 'asc' } });
                
                    return res.status(HttpStatus.OK).send({ audits: updatedAudits });
                  } catch (error) {
                    console.log('error: ', error);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('An error occurred while fetching audits');
                  }
                }

            @@Post('/new')
            @UseGuards(AuthGuard)
            async createNew(@Res() res, @Req() req) {
              const upload = multer().none();
              
              upload(req, res, async (err: any) => {
                if (err) {
                  return res.status(400).send(err);
                }
                
                try {
                  const user = await this.prisma.user.findUnique({ where: { email: req.user.email } });
          
                  if (!user) {
                    // user not found!
                    return res.status(404).send('User not found');
                  }
          
                  console.log('xxxxxxxxxbodydate === ', req.body.planningDate);
                  const count = await this.prisma.audit.count();
                  const newCode = `AUD-${moment().year()}-${String(count + 1).padStart(4, '0')}`;
                  const audit = await this.prisma.audit.create({
                    data: {
                      responsableId: user.id,
                      type: req.body.type,
                      code: newCode,
                      processus: req.body.processus,
                      planningDate: new Date(req.body.planningDate),
                      realisationDate: new Date(req.body.realisationDate),
                      lieu: 'IFF',
                    },
                  });
          
                  return res.status(201).send(audit);
                } catch (error) {
                  console.log(error);
                  return res.status(500).send('Internal server error');
                }
              });
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
                  return res.status(HttpStatus.OK).send({audit});;
                } else {
                  return res.status(HttpStatus.NOT_FOUND).send('Audit not found');
                }
              } catch (error) {
                console.error('Error fetching audit:', error);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error fetching audit');
              }
            }

            
            @Post('/edit')
            @UseGuards(AuthGuard)
            @UseInterceptors(FileInterceptor('file', {
                storage: multer.diskStorage({
                    destination: (req, file, cb) => {
                        const uploadPath = 'C:/Users/evoun/Desktop/IFF/smq-frontend/src/Audits';
                        console.log('upload path: ', uploadPath);
                        if (!fs.existsSync(uploadPath)) {
                            fs.mkdirSync(uploadPath, { recursive: true });
                        }
                        cb(null, uploadPath);
                    },
                    filename: (req, file, cb) => {
                        cb(null, file.originalname);
                    }
                })
            }))
            async editaudit(
              @Res() res: Response, 
              @Req() req: any, 
              @Body() body: any,
              @UploadedFile() file: Express.Multer.File,
            ) {
              console.log('lets edit')
              try {
                let filePath;
                if (file) {
                  filePath = file.path.replace(/\\/g, '/');
                }
            
                // Log the incoming body to debug
                console.log('body:', body);
            
                // Ensure the id is being parsed correctly
                const id = parseInt(body.id);
                if (isNaN(id)) {
                  throw new Error('Invalid ID');
                }
                console.log('DAaateEEEE:', body.planningDate)
            
                await this.prisma.audit.update({
                  where: { id },
                  data: {
                    responsableId: parseInt(body.responsableId),
                    type: body.type,
                    processus: body.processus,
                    planningDate: new Date(body.planningDate),
                    realisationDate: new Date(body.realisationDate),
                    lieu: body.lieu,
                    path: filePath,
                  }
                });
            
                if (file) {
                  console.log('there is a file');
                  await this.prisma.audit.update({
                    where: { id },
                    data: { status: 2 }
                  });
                }
            
              } catch (error) {
                console.log('error: ', error);
              }
              return res.status(HttpStatus.OK).send('okk');
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