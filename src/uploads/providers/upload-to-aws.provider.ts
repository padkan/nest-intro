import { Injectable, RequestTimeoutException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';

@Injectable()
export class UploadToAwsProvider {
  constructor(
    private readonly configService: ConfigService,
    private readonly s3: S3Client,
    @Inject('winston') private readonly logger: Logger,
  ) {}
  public async fileUpload(file: Express.Multer.File): Promise<string> {
    const bucketName = this.configService.get<string>(
      'appConfig.awsBucketName',
    )!;
    const fileKey = this.generateFileName(file);
    this.logger.warn(`Uploading file to S3: ${fileKey}`);
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
          Body: file.buffer, // works with Multer memoryStorage
          ContentType: file.mimetype,
        }),
      );
      return fileKey;
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }

  private generateFileName(file: Express.Multer.File): string {
    const name = file.originalname.split('.')[0].replace(/\s/g, '').trim();
    const extension = path.extname(file.originalname);
    const timestamp = Date.now().toString();
    return `${name}-${timestamp}-${uuidv4()}${extension}`;
  }
}
