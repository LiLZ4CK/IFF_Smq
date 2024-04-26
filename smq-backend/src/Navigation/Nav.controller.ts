import { Body, Controller, Get, Post, Res, Req, Redirect, Param, UseGuards } from '@nestjs/common';
import { NavService } from './Nav.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt';
import { retry } from 'rxjs';
import { AuthGuard } from 'src/authuser/jwt.guard';


@Controller()
export class NavController{
	constructor(private readonly settingsService: NavService,
				private prisma: PrismaService,
                private jwtService: JwtService) {}


                @Get('dashboard')
                @UseGuards(AuthGuard)
                async getDashboardVerstion(@Req() req: Request, @Res() res: Response){
                    const user = await this.prisma.user.findUnique({where: {email:  req['user'].email}})
                    if (!user){
                        return res.status(HttpStatus.NOT_FOUND).send('User not found')
                    }
                    const rol = await this.prisma.role.findFirst({where:{id: user.roleId}})
                    if (!rol){
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('try reconnect')
                    }
                    if(rol.name == 'user'){
                        return res.status(HttpStatus.OK).send({rol})
                    }
                    else if (rol.name == 'admin'){
                        const users = await this.prisma.user.findMany({orderBy:{id: 'asc'}})
                        return res.status(HttpStatus.OK).send({rol, users});
                    }
                }

        
    }