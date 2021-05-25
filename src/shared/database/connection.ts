import ormConfig from '@config/ormConfig';
import { Connection, createConnection } from 'typeorm';

export default async (name = 'default'): Promise<Connection> => {
  return createConnection(
    Object.assign(ormConfig, {
      name,
    }),
  );
};
