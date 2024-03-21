import { Body, Controller, Get, Post, Res, Redirect, Param, UseGuards, Req } from '@nestjs/common';
import { SettingsService } from './Settings.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/authuser/jwt.guard';
import { retry } from 'rxjs';

@Controller()
export class SettingsController{
	constructor(private readonly settingsService: SettingsService,
				private prisma: PrismaService,
                private jwtService: JwtService) {}

        
        @Post('/changepass')
        @UseGuards(AuthGuard)
        async ChangePass(
            @Body('oldPassword') oldpass: string,
            @Body('newPassword') pass: string,
            @Body('confirmPassword') confpass: string,
            @Res() res: Response,
            @Req() req: Request){

                console.log('oldpass='+oldpass +' pass='+ pass +' confpass='+ confpass)
            if (oldpass == pass){
                console.log('old and new password must be different !')
                return res.status(HttpStatus.BAD_REQUEST).send('old and new password must be different !')
            }
            if (pass != confpass){
                console.log('confirmation not correct')
                return res.status(HttpStatus.BAD_REQUEST).send('confirmation not correct')
            }
            const user = await this.prisma.user.findUnique({where:{email: req['user'].email}})
            console.log('this user is :' + user.name)
            if (!user){
                console.log('internal error token not found')
                return res.status(HttpStatus.BAD_REQUEST).send('internal error token not found')
            }
            let iscorrect = await bcrypt.compare(pass, user.password)
			if (!iscorrect){
				console.log('wrong password ')
				return res.status(HttpStatus.BAD_REQUEST).send('Wrong password!')
            }
            const bcrpass = await bcrypt.hash(pass, 10);
            await this.prisma.user.update({where: {email: user.email}, data:{ password: pass}})
            console.log('gg ez ')
            return res.status(HttpStatus.OK)

        }

        @Post('/changename')
        @UseGuards(AuthGuard)
        async ChangeName(
            @Body('newName') newName: string,
            @Body('confirmPassword') pass: string,
            @Res() res: Response,
            @Req() req: Request){
            const user = await this.prisma.user.findUnique({where:{email: req['user'].email}})
            if (!user){
                console.log('internal error token not found')
                return res.status(HttpStatus.BAD_REQUEST).send('internal error token not found')
            }
            let iscorrect = await bcrypt.compare(pass, user.password)
			if (!iscorrect){
				console.log('wrong password ')
				return res.status(HttpStatus.BAD_REQUEST).send('Wrong password!')
			 }
            const otheruser = await this.prisma.user.findUnique({where:{name: newName}})
                if (otheruser){
                console.log('chose a diffrent name')
				return res.status(HttpStatus.BAD_REQUEST).send('chose a diffrent name')
            }
            if (user.name == newName){
                console.log('chose a diffrent name')
				return res.status(HttpStatus.BAD_REQUEST).send('chose a diffrent name')
            }
            await this.prisma.user.update({where: {email: user.email}, data:{ name: newName}})
            return res.status(HttpStatus.OK)
        }

    }