import { permissions } from '@config/permissions';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import createConnection from '@shared/database/connection';
import { app } from '@shared/infra/http/app';
import { hash } from '@shared/services/password';

let connection: Connection;
describe('GetAllAccountTypeController', () => {
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

  it('should be able to get all account types', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const accountType = await request(app)
      .post('/account-types')
      .send({
        name: 'testing',
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get('/account-types')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([accountType.body]);
  });

  it('should be able to get all account types with pagination', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    await request(app)
      .post('/account-types')
      .send({
        name: 'test',
      })
      .set('Authorization', `Bearer ${token}`);

    await request(app)
      .post('/account-types')
      .send({
        name: 'test2',
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get('/account-types')
      .query({
        page: 2,
        per_page: 1,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it('should not be able to get all account types without authenticate', async () => {
    const response = await request(app).get('/account-types');

    expect(response.status).toBe(401);
  });

  it('should be able to get all account types by name', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const accountType = await request(app)
      .post('/account-types')
      .send({
        name: 'by name',
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get('/account-types')
      .query({
        name: 'by name',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([accountType.body]);
  });
});
