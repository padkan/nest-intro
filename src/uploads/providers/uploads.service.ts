import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Express } from 'express';

import { UploadToAwsProvider } from './upload-to-aws.provider';
import { Upload } from '../upload.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UploadFile } from '../interfaces/upload-file.interface';
import { FileType } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {
  constructor(
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
    private readonly configService: ConfigService,
  ) {}

  public async uploadFile(file: Express.Multer.File) {
    const supportedMimeTypes = [
      'image/gif',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/svg+xml',
      'image/webp',
    ];

    if (!supportedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Unsupported MIME type');
    }

    try {
      const s3FileUrl = await this.uploadToAwsProvider.fileUpload(file);

      const uploadFile: UploadFile = {
        name: file.originalname,
        path: s3FileUrl,
        type: FileType.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };

      const upload = this.uploadRepository.create(uploadFile);
      return await this.uploadRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
