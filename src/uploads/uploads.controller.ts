import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Inject,
  Query,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiHeaders, ApiOperation } from '@nestjs/swagger';
import type { Express } from 'express';
import * as multer from 'multer';
import { UploadsService } from './providers/uploads.service';
import { Logger } from 'winston';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    @Inject('winston') private readonly logger: Logger,
  ) {
    this.logger.warn('UploadsController initialized');
  }

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

  @Delete('file')
  @HttpCode(200) // Set HTTP status code to 200 OK
  public async deleteFile(@Query('path') path: string) {
    this.logger.warn(`Files Deleted: ${path}`);
    await this.uploadsService.deleteFile(path);
    return { deleted: true, path };
  }
}
