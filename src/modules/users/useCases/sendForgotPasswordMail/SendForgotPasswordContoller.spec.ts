import { permissions } from '@config/permissions';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import createConnection from '@shared/database/connection';
import { app } from '@shared/infra/http/app';
import { hash } from '@shared/services/password';

let connection: Connection;
describe('SendForgotPasswordController', () => {
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

  it('should be able to send forgot password email', async () => {
    const response = await request(app).post('/password/forgot').send({
      email: 'admin@admin.com',
    });

    expect(response.status).toBe(200);
  });

  it('should not be able to send forgot password email if email does not exists', async () => {
    const response = await request(app).post('/password/forgot').send({
      email: 'wrong_email@wrong_email.com',
    });

    expect(response.status).toBe(400);
  });

  it('should not be able to send forgot password email with missing fields', async () => {
    const response = await request(app).post('/password/forgot');

    expect(response.status).toBe(400);
  });
});
