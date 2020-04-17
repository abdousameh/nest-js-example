import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { app } from './app.e2e-spec';

export const testUserSuite = () =>
  describe('Users suite tests', () => {
    const username = 'jess@gmail.co';
    const user = {
      lastname: 'Jess',
      firstname: 'Smith',
      email: username,
      password: 'N7tr$rtyui',
    };
    it('/users (POST)', async () => {
      const hexaReg = /^[a-f0-9]/i;
      return await request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          if (!(body.id as string).match(hexaReg)) {
            throw new Error(`Bad id data format for id ${body.id}`);
          }
        });
    });

    it('/users (POST)', async () => {
      const expectedResponse = {
        statusCode: 422,
        message: `This email ${username} already exists.`,
        error: 'Unprocessable Entity',
      };
      return await request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(422)
        .expect(expectedResponse);
    });

    it('/users (DELETE)', async () => {
      return await request(app.getHttpServer())
        .delete('/users/' + username)
        .expect(200);
    });
  });
