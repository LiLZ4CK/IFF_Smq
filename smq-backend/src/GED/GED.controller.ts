import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs-extra';
import { readFile } from 'fs/promises';

interface FileData {
  id: string; 
  name: string; 
  ext?: string; 
  isDir?: boolean; 
  isHidden?: boolean; 
  isSymlink?: boolean; 
  openable?: boolean; 
  selectable?: boolean; 
  size?: number; 
  modDate?: Date; 
  parentId?: string; 
  childrenIds?: string[]; 
}

const rootdir = path.resolve(__dirname, '../../../smq-frontend/src/PS Stratégie et Pilotage');

function removeLeadingPath(fullPath: string, leadingPath: string): string {
  const relativePath = fullPath.replace(leadingPath, '');
  return relativePath.startsWith(path.sep) ? relativePath.slice(1) : relativePath; 
}

async function buildFolderStructure(directoryPath: string, leadingPath: string): Promise<FileData[]> {
  const files = await fs.readdir(directoryPath);
  const fileDetails = await Promise.all(files.map(async (file) => {
    const filePath = path.join(directoryPath, file);
    const fileStats = await fs.stat(filePath);
    if (fileStats.isDirectory()) {
      const children = await buildFolderStructure(filePath, leadingPath);
      return {
        id: removeLeadingPath(filePath, leadingPath),
        name: file,
        isDir: true,
        childrenIds: children.map((child) => child.id),
        childrenCount: children.length,
      };
    } else {
      return {
        id: removeLeadingPath(filePath, leadingPath),
        name: file,
        isDir: false,
        size: fileStats.size,
      };
    }
  }));
  return fileDetails;
}

function buildFolderChain(currentPath: string, leadingPath: string): FileData[] {
  const parts = currentPath.replace(leadingPath, '').split(path.sep).filter(part => part);
  return parts.map((part, index) => {
    const id = parts.slice(0, index + 1).join(path.sep);
    return {
      id,
      name: part
    };
  });
}

@Controller('GED')
export class GEDController {
  async removelast(fullPath: string){
    const pathSegments = path.parse(fullPath).dir.split(path.sep);
    return pathSegments.join(path.sep);
  }
  @Get('all')
  async getDirectoryStructure(@Res() res: Response) {
    try {
      const directoryPath = rootdir;
      const folderStructure = await buildFolderStructure(directoryPath, directoryPath);
      const files = await fs.readdir(directoryPath);

      const fileDetails = await Promise.all(files.map(async (file) => {
        const filePath = path.join(directoryPath, file);
        const fileStats = await fs.stat(filePath);
        return {
          id: removeLeadingPath(filePath, directoryPath),
          name: file,
          isDir: fileStats.isDirectory(),
          size: fileStats.size,
        };
      }));

      const folderChain = [
        {
          id: '',
          name: 'root'
        }
      ];

      const respp = { files: fileDetails, folderChain: folderChain };
      return res.status(HttpStatus.OK).send(respp);
    } catch (error) {
      console.error('Error fetching directory structure:', error);
      throw new Error('Failed to fetch directory structure');
    }
  }

  @Post('open')
  async openit(@Body('pathh') pathh: string, @Res() res: Response) {
    try {
      const directoryPath = path.join(rootdir, pathh);
      const files = await fs.readdir(directoryPath);
      console.log('retour : ', directoryPath);

      const fileDetails = await Promise.all(files.map(async (file) => {
        const filePath = path.join(directoryPath, file);
        const fileStats = await fs.stat(filePath);
        return {
          id: removeLeadingPath(filePath, rootdir), 
          name: file,
          isDir: fileStats.isDirectory(),
          size: fileStats.size,
        };
      }));

      const folderChain = buildFolderChain(directoryPath, rootdir);
      folderChain.unshift({
        id: '',
        name: 'root'
      });

      const respp = { files: fileDetails, folderChain: folderChain };
      return res.status(HttpStatus.OK).send(respp);
    } catch (error) {
      console.error('Error fetching directory structure:', error);
      throw new Error('Failed to fetch directory structure');
    }
  }

  @Post('back')
  async baack(@Body('pathh') pathh: string, @Res() res: Response) {
    try {
      // If pathh is empty, set directoryPath to rootdir
      let directoryPath;
      if (!pathh) {
        directoryPath = rootdir;
      } else {
        directoryPath = path.join(rootdir, pathh);
  
        // If the path ends with a trailing slash, remove it
        if (directoryPath.endsWith(path.sep)) {
          directoryPath = directoryPath.slice(0, -1);
        }
  
        // Remove the last directory from the path
        directoryPath = path.dirname(directoryPath);
      }
  
      const files = await fs.readdir(directoryPath);
      console.log('Parent Directory: ', directoryPath);
  
      const fileDetails = await Promise.all(files.map(async (file) => {
        const filePath = path.join(directoryPath, file);
        const fileStats = await fs.stat(filePath);
        return {
          id: removeLeadingPath(filePath, rootdir),
          name: file,
          isDir: fileStats.isDirectory(),
          size: fileStats.size,
        };
      }));
  
      const folderChain = buildFolderChain(directoryPath, rootdir);
      folderChain.unshift({
        id: '',
        name: 'root'
      });
  
      const respp = { files: fileDetails, folderChain: folderChain };
      return res.status(HttpStatus.OK).send(respp);
    } catch (error) {
      console.error('Error fetching directory structure:', error);
      throw new Error('Failed to fetch directory structure');
    }
  }
  
  @Post('pdf')
  async openpdf(@Body('file') pdff: string, @Res() res: Response) {
    try {
      const filePath = path.join(rootdir, pdff); 
      const pdfData = await readFile(filePath);
      res.set('Content-Type', 'application/pdf');
      res.send(pdfData);
    } catch (error) {
      console.error('Error fetching PDF:', error);
      res.status(404).send('PDF not found');
    }
  }

  @Post('xlsx')
  async openxlsx(@Body('file') file: string, @Res() res: Response) {
    try {
      const xlsxPath = path.join(rootdir, file); 
      const xlsxData = await readFile(xlsxPath);
      res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(xlsxData);
    } catch (error) {
      console.error('Error fetching XLSX:', error);
      throw new HttpException('XLSX not found', HttpStatus.NOT_FOUND);
    }
  }

  @Delete('/del/file')
  async deletefile(@Body('file') file: string, @Res() res: Response) {
    try {
      const filePath = path.join(rootdir, file); 
      await fs.promises.unlink(filePath);
      const pathh = removeLeadingPath(filePath, rootdir);
      res.status(HttpStatus.OK).send(await this.openit(pathh, res));
    } catch (error) {
      res.status(HttpStatus.FORBIDDEN).send(error);
    }
  }
}
