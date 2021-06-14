import { permissions } from '@config/permissions';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import createConnection from '@shared/database/connection';
import { app } from '@shared/infra/http/app';
import { hash } from '@shared/services/password';

let connection: Connection;
describe('DeleteAccountTypeController', () => {
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

  it('should be able to delete an account type', async () => {
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
      .delete(`/account-types/${accountType.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it('should not be able to delete an account type without authenticate', async () => {
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

    const response = await request(app).delete(
      `/account-types/${accountType.body.id}`,
    );

    expect(response.status).toBe(401);
  });

  it('should not be able to delete an account type if account type does not exists', async () => {
    const { token } = (
      await request(app).post('/auth').send({
        email: 'admin@admin.com',
        password: 'admin123',
      })
    ).body;

    const response = await request(app)
      .delete(`/account-types/${uuid()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});
