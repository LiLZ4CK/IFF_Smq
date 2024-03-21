import { Body, Controller, Get, Post, Res, Redirect, Param, UseGuards } from '@nestjs/common';
import { NavService } from './Nav.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt';
import { retry } from 'rxjs';

@Controller()
export class NavController{
	constructor(private readonly settingsService: NavService,
				private prisma: PrismaService,
                private jwtService: JwtService) {}


                

        
    }