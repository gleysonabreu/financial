import { permissions } from '@config/permissions';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm/connection';
import { hash } from '@shared/services/password';

let connection: Connection;
describe('UpdateUserController', () => {
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

  it('should be able to update an user', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .put('/users')
      .send({
        first_name: 'Administrator',
        last_name: 'Admin',
        email: 'admin@admin.com',
        cpf: '00000000000',
        phone: '00000000000',
        birth_date: '1990-02-12',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.first_name).toEqual('Administrator');
  });

  it('should not be able to update an user without authenticate', async () => {
    const response = await request(app).put('/users').send({
      first_name: 'Administrator',
      last_name: 'Admin',
      email: 'admin@admin.com',
      cpf: '00000000000',
      phone: '00000000000',
      birth_date: '1990-02-12',
    });

    expect(response.status).toBe(401);
  });

  it('should not be able to update an user with missing fields', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .put('/users')
      .send({
        first_name: 'Administrator',
        last_name: 'Admin',
        email: 'admin@admin.com',
        phone: '00000000000',
        birth_date: '1990-02-12',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('should not be able to update an user if email already exists', async () => {
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

    const response = await request(app)
      .put('/users')
      .send({
        first_name: 'Administrator',
        last_name: 'Admin',
        email: 'test@test.com',
        cpf: '00000000000',
        phone: '00000000000',
        birth_date: '1990-02-12',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('should not be able to update an user if phone already exists', async () => {
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
        cpf: '00000000003',
        phone: '00000000003',
        email: 'test@test.com.br',
        password: '1234567',
        birth_date: '1990-02-12',
        permission: 'MANAGER',
      });

    const response = await request(app)
      .put('/users')
      .send({
        first_name: 'Administrator',
        last_name: 'Admin',
        email: 'admin@admin.com',
        cpf: '00000000000',
        phone: '00000000003',
        birth_date: '1990-02-12',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('should not be able to update an user if cpf already exists', async () => {
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
        cpf: '00000000004',
        phone: '00000000004',
        email: 'test@test.com.br.us',
        password: '1234567',
        birth_date: '1990-02-12',
        permission: 'MANAGER',
      });

    const response = await request(app)
      .put('/users')
      .send({
        first_name: 'Administrator',
        last_name: 'Admin',
        email: 'admin@admin.com',
        cpf: '00000000004',
        phone: '00000000000',
        birth_date: '1990-02-12',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});
