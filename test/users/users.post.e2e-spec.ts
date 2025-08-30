import { INestApplication, Body } from '@nestjs/common';
import { App } from 'supertest/types';
import { ConfigService } from '@nestjs/config';
import request from 'supertest';
import { dropDatabase } from 'test/helpers/drop-database.helper';
import { bootstrapNestApplication } from 'test/helpers/bootstrap-nest-application.helper';
import { Server } from 'http';
import { response } from 'express';
import {
  completeUser,
  missingEmail,
  missingFirstName,
  missingPassword,
} from './users.post.e2e.spec.sample-data';

describe('[Users] @Post Endpoints', () => {
  let app: INestApplication;
  let config: ConfigService;
  let httpServer: Server;

  beforeEach(async () => {
    app = await bootstrapNestApplication();

    config = app.get<ConfigService>(ConfigService);
    httpServer = app.getHttpServer() as Server;
  });

  afterEach(async () => {
    await dropDatabase(config);
    await app.close();
  });
  /*
If I get a bad request exception.
This means this API endpoint is public because in case of unauthorized exception, we get unauthorized
exception which has a code of 401, whereas bad request exception has a code of 400.
*/

  it('/users - Endpoint is public', async () => {
    await request(httpServer).post('/users').send({}).expect(400);
  });
  it('/users - firstName is mandatory', async () => {
    await request(httpServer).post('/users').send(missingFirstName).expect(400);
  });
  it('/users - email is mandatory', async () => {
    await request(httpServer).post('/users').send(missingEmail).expect(400);
  });
  it('/users - password is mandatory', async () => {
    await request(httpServer).post('/users').send(missingPassword).expect(400);
  });
  it('/users - Valid request successfully creates a user', async () => {
    await request(httpServer)
      .post('/users')
      .send(completeUser)
      .then(({ body }) => {
        expect(body).toBeDefined();
        expect(body.data.firstName).toBe(completeUser.firstName);
        expect(body.data.lastName).toBe(completeUser.lastName);
        expect(body.data.email).toBe(completeUser.email);
      });
  });
  it('/users - password is not required in response', async () => {
    await request(httpServer)
      .post('/users')
      .send(completeUser)
      .then(({ body }) => {
        expect(body).toBeDefined();
        expect(body.data.password).toBeUndefined();
      });
  });
  it('/users - googleId is not required in response', async () => {
    await request(httpServer)
      .post('/users')
      .send(completeUser)
      .then(({ body }) => {
        expect(body).toBeDefined();
        expect(body.data.googleId).toBeUndefined();
      });
  });
});
