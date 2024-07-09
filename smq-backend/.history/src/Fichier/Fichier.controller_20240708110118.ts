import { Body, Controller, Get, Post, Res, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FichierService } from './Fichier.service';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import { readFile } from 'fs/promises';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/authuser/jwt.guard';
import * as path from 'path';
import * as fs from 'fs';
import * as multer from 'multer';

@Controller('/Fichier')
export class FichierController {
    constructor(
        private readonly fichierService: FichierService,
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    @Get('/all')
    async getAll(@Res() res: Response) {
        const fichier = await this.prisma.fichier.findMany();
        return res.status(HttpStatus.OK).send({ fichier });
    }

    @Post('/new')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                const uploadPath = 'C:/Users/evoun/Desktop/IFF/smq-frontend/src/Pilotage';
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
    async createNew(
        @Req() req: any,
        @Res() res: Response,
        @UploadedFile() file: Express.Multer.File,
        @Body() fich: any,
    ) {
        console.log('Received file:', file);
        console.log('Received form data:', fich);
        try {
            console.log('editfich')
            const userr = await this.prisma.user.findUnique({ where: { email: req.user.email } });
            if (!userr) {
                return res.status(HttpStatus.NOT_FOUND).send('User not found');
            }

            const filePath = file.path.replace(/\\/g, '/'); // Normalize the file path
            const fichier = await this.prisma.fichier.create({
                data: {
                    path: filePath,
                    name: file.filename,
                    group: fich.group,
                    redacteur: fich.redacteur,
                    typeDoc: fich.typeDoc,
                    processus: fich.processus,
                    natureDoc: fich.natureDoc,
                    produit: fich.produit,
                    service: fich.service,
                    compleme: fich.compleme,
                    commentaire: fich.commentaire,
                }
            });
            console.log('Saved file path:', fichier.path);
            return res.status(HttpStatus.OK).send('File uploaded successfully');
        } catch (error) {
            console.error('Error:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error creating file');
        }
    }

    @Post('pdf')
      async openpdf(@Body('file') pdff: string, @Res() res: Response) {
        try {
          const pdfData = await readFile(pdff);
          res.set('Content-Type', 'application/pdf');
          res.send(pdfData);
        } catch (error) {
          console.error('Error fetching PDF:', error);
          res.status(404).send('PDF not found');
        }
      }

    @Post('edit')
    async editFich(@Body('info') info: any, @Res() res: Response){
        try {
            console.log('editfich')
       await this.prisma.fichier.update({where: {id: info.id}, data:{
            redacteur: info.redacteur,
            typeDoc: info.typeDoc,
            processus: info.processus,
            natureDoc: info.natureDoc,
            produit: info.produit,
            service: info.service,
            compleme: info.compleme,
            commentaire: info.commentaire,
        }})
        return res.status(HttpStatus.OK).send('File uploaded successfully');
    } catch (error) {
        console.error('Error:', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error edit file');
    }
}
}