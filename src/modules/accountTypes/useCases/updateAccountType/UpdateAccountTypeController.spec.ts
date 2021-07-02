import { permissions } from '@config/permissions';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm/connection';
import { hash } from '@shared/services/password';

let connection: Connection;
describe('UpdateAccountTypeController', () => {
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

  it('should be able to update an account type', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const accountType = await request(app)
      .post('/account-types')
      .send({
        name: 'test',
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .put(`/account-types/${accountType.body.id}`)
      .send({
        name: 'test update',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual('test update');
  });

  it('should not be able to update an account type without authenticate', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const accountType = await request(app)
      .post('/account-types')
      .send({
        name: 'test2',
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .put(`/account-types/${accountType.body.id}`)
      .send({
        name: 'test update2',
      });

    expect(response.status).toBe(401);
  });

  it('should not be able to update an account type if account type does not exists', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .put(`/account-types/${uuid()}`)
      .send({
        name: 'test update',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('should not be able to update an account type if name already exists', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const accountType = await request(app)
      .post('/account-types')
      .send({
        name: 'test',
      })
      .set('Authorization', `Bearer ${token}`);

    await request(app)
      .post('/account-types')
      .send({
        name: 'test3',
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .put(`/account-types/${accountType.body.id}`)
      .send({
        name: 'test3',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('should not be able to update an account type with missing fields', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const accountType = await request(app)
      .post('/account-types')
      .send({
        name: 'test5',
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .put(`/account-types/${accountType.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});
