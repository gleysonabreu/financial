import dotenv from 'dotenv';
import { resolve } from 'path';

const envFile = (environment: string) => {
  let file: string;

  switch (environment) {
    case 'test':
      file = '.env.test';
      break;
    case 'dev':
      file = '.env.dev';
      break;
    default:
      file = '.env';
  }

  return file;
};

dotenv.config({
  path: resolve(__dirname, '..', '..', envFile(process.env.NODE_ENV)),
});
