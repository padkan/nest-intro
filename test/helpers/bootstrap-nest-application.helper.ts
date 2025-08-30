import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AppModule } from './../../src/app.module';
import { appCreate } from '../../src/app.create';

export async function bootstrapNestApplication(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, ConfigModule],
    providers: [ConfigService],
  }).compile();

  const app: INestApplication = moduleFixture.createNestApplication();
  appCreate(app);
  await app.init();
  return app;
}
