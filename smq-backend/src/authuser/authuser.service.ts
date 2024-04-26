import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service';
import { text } from 'stream/consumers';
import { emit } from 'process';

@Injectable()
export class AuthuserService{
    constructor(private prisma: PrismaService,
                private jwtService: JwtService,
                private readonly mailerService: MailerService
                ) {}

    
   async senderMail(email: string, token: string)  {
       try{
        const nodemailer = require("nodemailer");
        const verificationCode  = Math.floor(1000 + Math.random() * 9000);
        const verificationLink = `http://localhost:8000/VerificationForm/${token}`
        const info = await this.mailerService.sendMail({
          from: "sender",
          to: email, // list of receivers
          subject: "Welcome to IFF SMQ ✔", // Subject line
          text: "Verification", // plain text body
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; border-radius: 10px;">
              <h1 style="color: #333;">Welcome to Our Platform!</h1>
              <p style="color: #555;">Thank you for joining us. To complete your registration, please verify your email address:</p>
              <div style="background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <p style="font-size: 18px; margin-bottom: 10px;">Your verification code is: <strong style="color: #007bff;">${verificationCode}</strong>.</p>
                <p style="font-size: 16px;">Or click <a href="${verificationLink}" style="color: #007bff; text-decoration: none;">here</a> to confirm your registration.</p>
              </div>
            </div>
          `
        });
        const user = await this.prisma.user.update({where: {email: email}, data:{VerificationCode: verificationCode.toString()}})
    }
    catch(error){
        console.log('error:', error)
    }
    }


    async register(name: string, email: string, password: string) {
        try {
          const bcrpass = await bcrypt.hash(password, 10);
          const newUser = await this.prisma.user.create({
            data: {
              name: name,
              email: email,
              password: bcrpass,
              roleId: (await this.prisma.role.findUnique({where:{name: 'user'}})).id
            },
          });
          const token = this.jwtService.signAsync({email}, {secret: process.env.JWT_SECRET})
          //const token = await this.jwtService.sign({ email: newUser.email });
          return token;
        } catch (error) {
          console.error('Error occurred during registration:', error);
          throw error; // Rethrow the error to be handled by the caller
        }
      }
}      