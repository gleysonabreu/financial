import 'reflect-metadata';
import 'express-async-errors';
import upload from '@config/upload';
import cors from 'cors';
import express from 'express';

import { HandleAppError } from '@shared/errors/HandleAppError';

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
app.use(router);
app.use(HandleAppError);
export { app };
