import { Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';

@Injectable()
export class DeleteFromAwsProvider {
  constructor(
    private readonly configService: ConfigService,
    private readonly s3: S3Client,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  public async deleteFile(fileKey: string): Promise<void> {
    const bucketName = this.configService.get<string>(
      'appConfig.awsBucketName',
    )!;

    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
        }),
      );
      this.logger.info(`File deleted successfully: ${fileKey}`);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }
}
