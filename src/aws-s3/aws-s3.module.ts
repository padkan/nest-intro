import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
@Module({
  providers: [
    {
      provide: S3Client,
      useFactory: (configService: ConfigService) =>
        new S3Client({
          region: configService.get<string>('appConfig.awsRegion')!,
          credentials: {
            accessKeyId: configService.get<string>('appConfig.awsAccessKeyId')!,
            secretAccessKey: configService.get<string>(
              'appConfig.awsSecretAccessKey',
            )!,
          },
        }),
      inject: [ConfigService],
    },
  ],
  exports: [S3Client],
})
export class AwsS3Module {}
