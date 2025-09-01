import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiHeaders, ApiOperation } from '@nestjs/swagger';
import type { Express } from 'express';
import * as multer from 'multer';
import { UploadsService } from './providers/uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  @ApiHeaders([
    {
      name: 'Content-Type',
      description: 'multipart/form-data',
    },
    {
      name: 'Authorization',
      description: 'Bearer token',
    },
  ])
  @ApiOperation({
    summary: 'Upload a file',
    description: 'Uploads a file to the server',
  })
  @Post('file')
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return await this.uploadsService.uploadFile(file);
  }
}
