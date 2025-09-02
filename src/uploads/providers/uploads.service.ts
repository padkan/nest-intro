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
import { DeleteFromAwsProvider } from './delete-from-aws.provider';
import { FileResource } from '../enums/file-resources.enum';

@Injectable()
export class UploadsService {
  constructor(
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    private readonly deleteFromAwsProvider: DeleteFromAwsProvider,
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
      const key = await this.uploadToAwsProvider.fileUpload(file);
      const bucketName = this.configService.get<string>(
        'appConfig.awsBucketName',
      )!;
      const s3FileUrl = `https://${bucketName}.s3.${this.configService.get<string>(
        'appConfig.awsRegion',
      )}.amazonaws.com/${key}`;

      const uploadFile: UploadFile = {
        name: key,
        path: s3FileUrl,
        type: FileType.IMAGE,
        mime: file.mimetype,
        size: file.size,
        resource: FileResource.POST_IMAGE,
      };

      const upload = this.uploadRepository.create(uploadFile);
      return await this.uploadRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  public async deleteFile(fileKey: string): Promise<void> {
    await this.deleteFromAwsProvider.deleteFile(fileKey);
    const deletedFile = await this.uploadRepository.findOne({
      where: { name: fileKey },
    });
    if (deletedFile) {
      await this.uploadRepository.remove(deletedFile);
    }
  }
}
