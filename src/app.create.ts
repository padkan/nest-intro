import { INestApplication } from '@nestjs/common';

import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';
import { config as awsConfig } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

export function appCreate(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  /** swagger setup */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description use base api http://localhost:3000')
    .setTermsOfService('http://localhost:3000/terms')
    .setLicense('MIT', 'https://opensource.org/license/mit/')
    .setContact(
      'Saeed Padkan',
      'https://github.com/saeedpadkan',
      's.padkan@gmail.com',
    )
    .addServer('http://localhost:3000', 'Local server')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // setup aws sdk for s3 image upload
  const configService = app.get(ConfigService);

  awsConfig.update({
    credentials: {
      accessKeyId: configService.get<string>('appConfig.awsAccessKeyId')!,
      secretAccessKey: configService.get<string>(
        'appConfig.awsSecretAccessKey',
      )!,
    },
    region: configService.get<string>('appConfig.awsRegion')!,
  });

  // enable CORS
  app.enableCors();
}
