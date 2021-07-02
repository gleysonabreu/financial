import { permissions } from '@config/permissions';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm/connection';
import { hash } from '@shared/services/password';

let connection: Connection;
describe('CreateUserController', () => {
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

  it('should be able to create an user if admin', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
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

    expect(response.status).toBe(201);
  });

  it('should not be able to create an user with missing fields', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
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

    expect(response.status).toBe(400);
  });

  it('should not be able to create a user if you are not an administrator', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'test@test.com',
        password: '1234567',
      })
    ).body;

    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
  });

  it('should not be able to create an user if email already exists', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        first_name: 'Testing',
        last_name: 'testing from test',
        cpf: '00000000003',
        phone: '00000000003',
        email: 'test@test.com',
        password: '1234567',
        birth_date: '1990-02-12',
        permission: 'MANAGER',
      });

    expect(response.status).toBe(400);
  });

  it('should not be able to create an user if phone already exists', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        first_name: 'Testing',
        last_name: 'testing from test',
        cpf: '00000000004',
        phone: '00000000002',
        email: 'test3@test.com',
        password: '1234567',
        birth_date: '1990-02-12',
        permission: 'MANAGER',
      });

    expect(response.status).toBe(400);
  });

  it('should not be able to create an user if cpf already exists', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        first_name: 'Testing',
        last_name: 'testing from test',
        cpf: '00000000000',
        phone: '00000000005',
        email: 'test4@test.com',
        password: '1234567',
        birth_date: '1990-02-12',
        permission: 'MANAGER',
      });

    expect(response.status).toBe(400);
  });

  it('should not be able to create an user with wrong permission', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        first_name: 'Testing',
        last_name: 'testing from test',
        cpf: '00000000006',
        phone: '00000000006',
        email: 'test6@test.com',
        password: '1234567',
        birth_date: '1990-02-12',
        permission: 'ANY',
      });

    expect(response.status).toBe(400);
  });
});
