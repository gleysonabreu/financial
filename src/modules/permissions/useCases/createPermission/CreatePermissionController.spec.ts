import { permissions } from '@config/permissions';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import createConnection from '@shared/database/connection';
import { app } from '@shared/infra/http/app';
import { hash } from '@shared/services/password';

let connection: Connection;
describe('CreatePermissionController', () => {
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

  it('should be able to create an permission', async () => {
    const { token, user } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .post('/permissions')
      .send({
        user_id: user.id,
        type: 'MANAGER',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('should not be able to create an permission if not admin', async () => {
    const { token, user } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        first_name: 'Testing',
        cpf: '00000000002',
        phone: '00000000002',
        email: 'test@test.com',
        password: '1234567',
        birth_date: '1990-02-12',
        permission: 'MANAGER',
      });

    const { token: userToken } = (
      await request(app).post('/auth').send({
        email: 'test@test.com',
        password: '1234567',
      })
    ).body;

    const response = await request(app)
      .post('/permissions')
      .send({
        user_id: user.id,
        type: 'MANAGER',
      })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(401);
  });

  it('should not be able to create an permission without authenticate', async () => {
    const { user } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app).post('/permissions').send({
      user_id: user.id,
      type: 'MANAGER',
    });
    expect(response.status).toBe(401);
  });

  it('should not be able to create an permission with missing fields', async () => {
    const { token, user } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .post('/permissions')
      .send({
        user_id: user.id,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('should not be able to create an permission if permission type is invalid', async () => {
    const { token, user } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .post('/permissions')
      .send({
        user_id: user.id,
        type: 'ANY',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('should no be able to create an permission if user does not exists', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .post('/permissions')
      .send({
        user_id: uuid(),
        type: 'MANAGER',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('should not be able to create an permission if permission already exists', async () => {
    const { token, user } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .post('/permissions')
      .send({
        user_id: user.id,
        type: 'ADMIN',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});
