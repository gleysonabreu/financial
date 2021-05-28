import 'reflect-metadata';
import 'express-async-errors';
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
app.use(router);
app.use(HandleAppError);
export { app };
