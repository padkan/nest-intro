import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadToAwsProvider {
  constructor(private readonly configService: ConfigService) {}
  public async fileUpload(file: Express.Multer.File): Promise<string> {
    const s3 = new S3({
      accessKeyId: this.configService.get<string>('appConfig.awsAccessKeyId'),
      secretAccessKey: this.configService.get<string>(
        'appConfig.awsSecretAccessKey',
      ),
      region: this.configService.get<string>('appConfig.awsRegion'),
    });

    const fileKey = this.generateFileName(file);

    try {
      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get<string>('appConfig.awsBucketName')!,
          Body: file.buffer, // Must use buffer with memoryStorage
          Key: fileKey,
          ContentType: file.mimetype,
        })
        .promise();

      return uploadResult.Location; // Public URL of the uploaded file
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }

  private generateFileName(file: Express.Multer.File) {
    const name = file.originalname.split('.')[0].replace(/\s/g, '').trim();
    const extension = path.extname(file.originalname);
    const timestamp = Date.now().toString();
    return `${name}-${timestamp}-${uuidv4()}${extension}`;
  }
}
