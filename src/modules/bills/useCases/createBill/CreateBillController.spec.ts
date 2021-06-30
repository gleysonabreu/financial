import { permissions } from '@config/permissions';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm/connection';
import { hash } from '@shared/services/password';

let connection: Connection;
describe('CreateBillController', () => {
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

  it('should be able to create an bill', async () => {
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
      .post('/bills')
      .send({
        account_type_id: accountType.body.id,
        value: 15,
        justification: 'Testing that',
        date: '1998-02-21',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to create an bill without authenticate', async () => {
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

    const response = await request(app).post('/bills').send({
      account_type_id: accountType.body.id,
      value: 15,
      justification: 'Testing that',
      date: '1998-02-21',
    });
    expect(response.status).toBe(401);
  });

  it('should not be able to create an bill if account type does not exists', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .post('/bills')
      .send({
        account_type_id: uuid(),
        value: 15,
        justification: 'Testing that',
        date: '1998-02-21',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('should not be able to create an bill with missing fields', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;
    const accountType = await request(app)
      .post('/account-types')
      .send({
        name: 'test4',
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .post('/bills')
      .send({
        account_type_id: accountType.body.id,
        value: 15,
        date: '1998-02-21',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});
