import { permissions } from '@config/permissions';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import createConnection from '@shared/database/connection';
import { app } from '@shared/infra/http/app';
import { hash } from '@shared/services/password';

let connection: Connection;
describe('GetAllUserController', () => {
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

  it('should be able to get all users', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it('should be able to get all users with pagination', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .get('/users')
      .query({
        per_page: 1,
        page: 2,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });

  it('should not be able to get all users without authenticate', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(401);
  });

  it('should not be able to get all users if not admin', async () => {
    const { token } = (
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
        last_name: 'testing from test',
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
      .get('/users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(401);
  });

  it('should be able to get all users by cpf', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .get('/users')
      .query({
        cpf: '000',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should be able to get all users by first name or last name', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .get('/users')
      .query({
        name: 'Admin',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });
});
