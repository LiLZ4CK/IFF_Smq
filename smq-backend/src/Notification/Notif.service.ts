import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt/dist';
import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';




@Injectable()
export class NotifService{
  constructor(private prisma: PrismaService,
    private readonly mailerService: MailerService,
    ){}
    private readonly logger = new Logger(NotifService.name);
    
    @Cron('0 9 * * 1-5')
    async handleCron() {
      const audits = await this.prisma.audit.findMany({where:{status: 0},orderBy:{planningDate: 'asc'}})
      console.log({audits})
      const today = moment();
      const soonAudits: any[] = [];
      for (let i = 0; audits[i]; i++){
          const daysDifference = Math.abs(today.diff(audits[i].planningDate, 'days'));
          if(daysDifference > 4){
              soonAudits.push(audits);
              //later here send path to the audit an name of audit ...
          }
        }
        // try{
             const respo = await this.prisma.user.findMany({where:{roleName: 'Responsable'}})
             for(let i = 0; respo[i]; i++){

               //     let email = 'evouna.w@gmail.com'
               //     const info = await this.mailerService.sendMail({
                 //       from: "sender",
                 //       to: email, // list of receivers
                 //       subject: "Welcome to IFF SMQ ✔", // Subject line
                 //       text: "Verification", // plain text body
                 //       html: `hi `
                 //     });
                 //     console.log('sent!')
            }
      // }
      // catch(error){
      //     console.log('error:', error)
      // }
    }
  }