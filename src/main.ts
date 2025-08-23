import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  const config = new DocumentBuilder()
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
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // enable CORS
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
