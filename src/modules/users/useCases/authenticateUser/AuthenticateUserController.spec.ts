import { permissions } from '@config/permissions';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import createConnection from '@shared/database/connection';
import { app } from '@shared/infra/http/app';
import { hash } from '@shared/services/password';

let connection: Connection;
describe('AuthenticateUserController', () => {
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

  it('should be able to authenticate', async () => {
    const response = await request(app).post('/auth').send({
      email: 'admin@admin.com',
      password: 'admin123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not be able to authenticate with wrong password', async () => {
    const response = await request(app).post('/auth').send({
      email: 'admin@admin.com',
      password: 'wrong-password',
    });

    expect(response.status).toBe(401);
  });

  it('should not be able to authenticate with wrong email', async () => {
    const response = await request(app).post('/auth').send({
      email: 'wrong_email@admin.com',
      password: 'admin123',
    });

    expect(response.status).toBe(401);
  });
});
