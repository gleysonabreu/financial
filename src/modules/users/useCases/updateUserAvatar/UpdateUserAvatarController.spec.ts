import { permissions } from '@config/permissions';
import path from 'path';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm/connection';
import { hash } from '@shared/services/password';

let connection: Connection;
const defaultAvatar = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  '..',
  'tmp',
  'default.jpg',
);
describe('UpdateUserAvatarController', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const idPermission = uuid();
    const password = await hash('admin123');

    await connection.query(
      `INSERT INTO users (id, first_name, last_name, email, password, cpf, birth_date, phone) VALUES('${id}', 'Admin', 'Admin', 'admin@admin.com', '${password}', '00000000000', '02-16-1998', '00000000000')`,
    );

    await connection.query(
      `INSERT INTO permissions (id, user_id, type) VALUES ('${idPermission}', '${id}', '${permissions.ADMIN}')`,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to update avatar', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .patch('/users/avatar')
      .attach('avatar', defaultAvatar)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it('should not be able to update avatar without authenticate', async () => {
    const response = await request(app)
      .patch('/users/avatar')
      .attach('avatar', defaultAvatar);

    expect(response.status).toBe(401);
  });

  it('should be able to update the avatar, but delete the old avatar before', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .patch('/users/avatar')
      .attach('avatar', defaultAvatar)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});
