import { Body, Controller, Get, Post, Res, Redirect, Param, UseGuards } from '@nestjs/common';
import { AuthuserService } from './authuser.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AuthuserController{
	constructor(private readonly authuserService: AuthuserService,
				private prisma: PrismaService,
				private jwtService: JwtService) {}


			 
	@Post('login')
	async login(
		@Body('email') email: string,
		@Body('password') password: string,
		@Res() res: Response
		) {
		  try{
			const Userr = await this.prisma.user.findUnique({ where: { email : email}})
			if (!Userr){
			  console.log('user not found ')
			  return res.status(HttpStatus.NOT_FOUND).send('User not found');
			}
			let iscorrect = await bcrypt.compare(password, Userr.password)
			if (!iscorrect){
				console.log('wrong password ')
				return res.status(HttpStatus.BAD_REQUEST).send('Wrong password!')
			  }
			  if (!Userr.isvirified){
			  console.log('not verified ')
			  return res.status(HttpStatus.BAD_REQUEST).send('Please verify your email first')
			}
			const token = await this.jwtService.signAsync({email: Userr.email}, {secret: process.env.JWT_SECRET})
			console.log('logged ')
			return res.status(HttpStatus.OK).send({ token });
			}
			catch (error){
			  console.log('error : '+ error)
			  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal error');
		}
	  }


	  @Post('register')
	  async register(
		@Body('name') name: string,
		@Body('email') email: string,
		@Body('password') password: string,
		@Body('confirmation') confirmation: string,
		@Res() res: Response
	  ) {
		if (password != confirmation) {
		  console.log('wrong pass')
		  return res.status(HttpStatus.NOT_FOUND).send('Wrong password!');
		}
		const userem = await this.prisma.user.findUnique({ where: { email: email } });
		if (userem) {
		  console.log('Email already used')
		  return res.status(HttpStatus.FORBIDDEN).send('Email already used');
		}
		const userna = await this.prisma.user.findUnique({ where: { name: name } });
		if (userna) {
		  console.log('use a different name')
		  return res.status(HttpStatus.FORBIDDEN).send('Email already used');
		}
		try {
		  console.log('lets send')
		  const token = await this.authuserService.register(name, email, password);
		  console.log('lets send2');
		  await this.authuserService.senderMail(email, token);
		  console.log('lets send3');
		  return res.status(HttpStatus.OK).send('ok');
		} catch (error) {
		  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error occurred while registering user');
		}
	  }

	  @Post('/Verifylink/:token')
	  //@Redirect('http://localhost:8000/', HttpStatus.OK)
	  async verifilink(@Param('token') jtoken, @Res() res: Response){
		console.log('here')
		const decodedToken = await this.jwtService.verify(jtoken, {secret: process.env.JWT_SECRET});
		const jmail = decodedToken.email;
		const user = await this.prisma.user.findUnique({where:{email: jmail}})
		if (user){
		  if (!user.isvirified){
			await this.prisma.user.update({where:{email:jmail}, data:{isvirified: true}})
			console.log('verified')
		  }
		  console.log('done')
		  return res.status(HttpStatus.OK).send('ok');
		}
		else{
		  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error occurred while verifying user');

		}
	  }
	  @Post('/Verifycode')
	  //@Redirect('http://localhost:8000/', HttpStatus.OK)
	  async verificode(@Res() res: Response, @Body('verification') verification: string,@Body('email') email: string,){
		const user = await this.prisma.user.findUnique({where:{email: email}})
		if (!user){
		  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('no user with that email');
		}
		if (user){
		  if (!user.isvirified){
			if (user.VerificationCode == verification){
			await this.prisma.user.update({where:{ email: email}, data:{isvirified: true}}) 
			  console.log('verified!')
			}
			else{
			  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error occurred while verifying user');
			}
		  }
		  return res.status(HttpStatus.OK).send('Error occurred while verifying user'); ;
		}
		else{
		  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error occurred while verifying user');

		}
	  }

}
