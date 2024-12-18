import { Body, Controller, Get, Post, Res, Redirect, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './Admin.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt';
import { retry } from 'rxjs';

@Controller()
export class AdminController{
	constructor(private readonly adminService: AdminService,
				private prisma: PrismaService,
                private jwtService: JwtService) {}

        
            @Get('/allusers')
            async getall(){
                return await this.prisma.user.findMany();
            }

    }