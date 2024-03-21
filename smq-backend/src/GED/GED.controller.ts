import { Body, Controller, Delete, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs-extra';
import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { STATUS_CODES } from 'http';

const rootdir = path.resolve(__dirname, '../../storage')
@Controller('GED')
export class GEDController { 
    //constructor(private readonly fs: fs.promises){}

     async removelast(fullPath: string){
        const pathSegments = path.parse(fullPath).dir.split(path.sep);
        return pathSegments.join(path.sep);
      }

    @Get('all')
    async getDirectoryStructure(@Res() res: Response) {
        try {
            // If path is not provided, use the current directory
            const directoryPath = rootdir; // Adjust the directory path as needed
            const files = await fs.readdir(directoryPath);
            
            const fileDetails = await Promise.all(files.map(async (file) => {
                const filePath = path.join(directoryPath, file);
                const fileStats = await fs.stat(filePath);
                return {
                    id: filePath, // Using file path as id
                    name: file,
                    isDir: fileStats.isDirectory(),
                    size: fileStats.size,
                    // Add other file details as needed
                };
            }));

            // Send the response in the correct format
            const respp = { files: fileDetails, folderChain: [{ id: directoryPath, name: directoryPath }] };
            return res.status(HttpStatus.OK).send(respp);
        } catch (error) {
            console.error('Error fetching directory structure:', error);
            console.log('error : ' + error)
            throw new Error('Failed to fetch directory structure');
        }
    }

    @Post('open')
    async openit(@Body('pathh') pathh: string,@Res() res: Response) {
        try {
            
            // If path is not provided, use the current directory
            console.log('hi : ' + pathh)
            if (pathh.length < rootdir.length){
                return res.status(HttpStatus.FORBIDDEN).send('you cant escape root folder')
            }
            const directoryPath = pathh; // Adjust the directory path as needed
            const files = await fs.readdir(directoryPath);
            
            const fileDetails = await Promise.all(files.map(async (file) => {
                const filePath = path.join(directoryPath, file);
                const fileStats = await fs.stat(filePath);
                return {
                    id: filePath, // Using file path as id
                    name: file,
                    isDir: fileStats.isDirectory(),
                    size: fileStats.size,
                    // Add other file details as needed
                };
            }));

            // Send the response in the correct format
            const respp = { files: fileDetails, folderChain: [{ id: directoryPath, name: directoryPath }] };
            console.log('done !!')
            return res.status(HttpStatus.OK).send(respp);
        } catch (error) {
            console.error('Error fetching directory structure:', error);
            console.log('error : ' + error)
            throw new Error('Failed to fetch directory structure');
        }
    }

    @Post('pdf')
    async openpdf(@Body('pdff') pdff: string, @Res() res: Response){
        console.log('hereee ! : ' + pdff)
        try {
            const pdfData = await readFile(pdff); // Read PDF file asynchronously
            res.set('Content-Type', 'application/pdf'); // Set appropriate content type
            res.send(pdfData); // Send PDF data in the response
        } catch (error) {
            console.error('Error fetching PDF:', error);
            res.status(404).send('PDF not found');
        }
    }

    @Delete('/del/file')
    async deletefile(@Body('file') file:string, @Res() res: Response ){
        try{
            await fs.promises.unlink(file)
            const pathh = await this.removelast(file)
            res.status(HttpStatus.OK).send(await this.openit(pathh, res))
        }
        catch(error){
            
            res.status(HttpStatus.FORBIDDEN).send(error)
        }
    }
}
