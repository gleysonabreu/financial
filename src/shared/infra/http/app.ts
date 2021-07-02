import 'reflect-metadata';
import 'express-async-errors';
import upload from '@config/upload';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { HandleAppError } from '@shared/errors/HandleAppError';

import swaggerFile from '../../../swagger.json';
import connection from '../typeorm/connection';
import '../../container';
import { router } from './routes';

class App {
  app: express.Application;
  constructor() {
    connection();
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
    this.app.use(
      `/${process.env.STORAGE_FOLDER}`,
      express.static(`${upload.tmpFolder}/${process.env.STORAGE_FOLDER}`),
    );
  }

  routes(): void {
    this.app.use(router);
    this.app.use(HandleAppError);
  }
}

export default new App().app;
