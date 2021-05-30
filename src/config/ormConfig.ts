import { ConnectionOptions } from 'typeorm';
import './dotEnv';

const ormConfig = {
  type: 'postgres',

  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  port: Number(process.env.TYPEORM_PORT),
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',

  entities: [process.env.TYPEORM_ENTITIES as string],
  migrations: [process.env.TYPEORM_MIGRATIONS as string],

  cli: {
    migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
  },

  ssl: process.env.TYPEORM_SSL,

  extra: {
    ssl: {
      rejectUnauthorized: process.env.TYPEORM_REJECT_UNAUTHORIZED,
    },
  },
} as ConnectionOptions;

export default ormConfig;
