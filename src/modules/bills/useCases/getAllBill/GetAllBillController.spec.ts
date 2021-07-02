import { permissions } from '@config/permissions';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm/connection';
import { hash } from '@shared/services/password';

let connection: Connection;
describe('GetAllBillController', () => {
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

  it('should be able to get all bills', async () => {
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

    const bill = await request(app)
      .post('/bills')
      .send({
        account_type_id: accountType.body.id,
        value: 15,
        justification: 'Testing that',
        date: '1998-02-21',
      })
      .set('Authorization', `Bearer ${token}`);
    const response = await request(app)
      .get('/bills')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body[0].id).toEqual(bill.body.id);
    expect(response.body.length).toBe(1);
  });

  it('should not be able to get all bills without authenticate', async () => {
    const response = await request(app).get('/bills');

    expect(response.status).toBe(401);
  });

  it('should be able to get all bills with pagination', async () => {
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

    await request(app)
      .post('/bills')
      .send({
        account_type_id: accountType.body.id,
        value: 15,
        justification: 'Testing that',
        date: '1998-02-21',
      })
      .set('Authorization', `Bearer ${token}`);

    await request(app)
      .post('/bills')
      .send({
        account_type_id: accountType.body.id,
        value: 15,
        justification: 'Testing Two',
        date: '1998-02-21',
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get('/bills')
      .query({
        page: 2,
        per_page: 1,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should be able to get all bills by account type id', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;
    const accountType = await request(app)
      .post('/account-types')
      .send({
        name: 'test3',
      })
      .set('Authorization', `Bearer ${token}`);

    await request(app)
      .post('/bills')
      .send({
        account_type_id: accountType.body.id,
        value: 15,
        justification: 'Testing that',
        date: '1998-02-21',
      })
      .set('Authorization', `Bearer ${token}`);

    await request(app)
      .post('/bills')
      .send({
        account_type_id: accountType.body.id,
        value: 15,
        justification: 'Testing Two',
        date: '1998-02-21',
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get('/bills')
      .query({
        account_type_id: accountType.body.id,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should be able to get all bills by date start and date finish', async () => {
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

    await request(app)
      .post('/bills')
      .send({
        account_type_id: accountType.body.id,
        value: 15,
        justification: 'Testing that',
        date: '2021-10-21',
      })
      .set('Authorization', `Bearer ${token}`);

    await request(app)
      .post('/bills')
      .send({
        account_type_id: accountType.body.id,
        value: 15,
        justification: 'Testing Two',
        date: '2021-10-21',
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get('/bills')
      .query({
        date_start: '2021-10-21',
        date_finish: '2021-10-21',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should be able to get all bills by account type id and date start and date finish', async () => {
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

    await request(app)
      .post('/bills')
      .send({
        account_type_id: accountType.body.id,
        value: 15,
        justification: 'Testing that',
        date: '2021-10-21',
      })
      .set('Authorization', `Bearer ${token}`);

    await request(app)
      .post('/bills')
      .send({
        account_type_id: accountType.body.id,
        value: 15,
        justification: 'Testing Two',
        date: '2021-10-21',
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get('/bills')
      .query({
        account_type_id: accountType.body.id,
        date_start: '2021-10-21',
        date_finish: '2021-10-21',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should be able to get all bills by justification', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;
    const accountType = await request(app)
      .post('/account-types')
      .send({
        name: 'test6',
      })
      .set('Authorization', `Bearer ${token}`);

    await request(app)
      .post('/bills')
      .send({
        account_type_id: accountType.body.id,
        value: 15,
        justification: 'justification',
        date: '2021-10-21',
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get('/bills')
      .query({
        justification: 'justification',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });
});
