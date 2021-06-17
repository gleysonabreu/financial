import 'reflect-metadata';
import 'express-async-errors';
import upload from '@config/upload';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { HandleAppError } from '@shared/errors/HandleAppError';

import swaggerFile from '../../../swagger.json';
import connection from '../../database/connection';
import '../../container';
import { router } from './routes';

connection();
const app = express();
app.use(cors());
app.use(express.json());
app.use(
  `/${process.env.STORAGE_FOLDER}`,
  express.static(`${upload.tmpFolder}/${process.env.STORAGE_FOLDER}`),
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(router);
app.use(HandleAppError);
export { app };
