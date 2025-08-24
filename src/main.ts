import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';
//import { awsConfig, ConfigService } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  //const configService = app.get(ConfigService);

  // awsConfig.update({
  //   accessKeyId: configService.get('appConfig.awsAccessKeyId'),
  //   secretAccessKey: configService.get('appConfig.awsSecretAccessKey'),
  //   region: configService.get('appConfig.awsRegion'),
  // });

  // enable CORS
  app.enableCors();
  // add global interceptors
  //app.useGlobalInterceptors(new DataResponseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
