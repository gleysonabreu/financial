import { permissions } from '@config/permissions';
import { v4 as uuid } from 'uuid';

import { hash } from '@shared/services/password';

import connect from '../connection';

async function createAdmin() {
  const connection = await connect();

  const id = uuid();
  const idPermission = uuid();
  const password = await hash('admin123');

  await connection.query(
    `INSERT INTO users (id, first_name, last_name, email, password, cpf, birth_date, phone) VALUES('${id}', 'Admin', 'Admin', 'admin@admin.com', '${password}', '00000000000', '02-16-1998', '00000000000')`,
  );

  await connection.query(
    `INSERT INTO permissions (id, user_id, type) VALUES ('${idPermission}', '${id}', '${permissions.ADMIN}')`,
  );

  await connection.close();
}

createAdmin().then(() => console.log('User admin created!'));
