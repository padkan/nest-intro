import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './providers/uploads.service';
import { UploadToAwsProvider } from './providers/upload-to-aws.provider';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './upload.entity';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';
import { DeleteFromAwsProvider } from './providers/delete-from-aws.provider';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, UploadToAwsProvider, DeleteFromAwsProvider],
  imports: [TypeOrmModule.forFeature([Upload]), AwsS3Module],
})
export class UploadsModule {}
