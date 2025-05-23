import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App } from 'supertest/types';
import { bootstrapNestApplication } from 'test/helpers/bootstrap-nest-applicatio.helper';
import { dropDatabase } from 'test/helpers/drop-database.helper';
import * as request from 'supertest';
import {
  completeUser,
  missionEmail,
  missionFirstName,
  missionPassword,
} from './users.post.e2e-spec.sample-data';

describe('[Users] @Post Endpoints', () => {
  let app: INestApplication;
  let config: ConfigService;
  let httpServer: App;
  beforeEach(async () => {
    // Instantiating the application
    app = await bootstrapNestApplication();
    // Exctracting the config service
    config = app.get<ConfigService>(ConfigService);
    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    await dropDatabase(config);
    await app.close();
  });

  it('/users - Endpoint is public', () => {
    return request(httpServer).post('/users').send({}).expect(400);
  });
  it('/users - firstName is mandatory', () => {
    return request(httpServer)
      .post('/users')
      .send(missionFirstName)
      .expect(400);
  });
  it('/users - email is mandatory', () => {
    return request(httpServer).post('/users').send(missionEmail).expect(400);
  });
  it('/users - password is mandatory', () => {
    return request(httpServer).post('/users').send(missionPassword).expect(400);
  });
  it('/users - Valid request successfully creates user', () => {
    return request(httpServer)
      .post('/users')
      .send(completeUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.data).toBeDefined();
        expect(body.data.firstName).toBe(completeUser.firstName);
        expect(body.data.lastName).toBe(completeUser.lastName);
        expect(body.data.email).toBe(completeUser.email);
      });
  });
  it('/users - password is not returned in response', () => {
    return request(httpServer)
      .post('/users')
      .send(completeUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.data.password).toBeUndefined();
      });
  });
  it('/users - googleId is not returned in response', () => {
    return request(httpServer)
      .post('/users')
      .send(completeUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.data.googleId).toBeUndefined();
      });
  });
});
