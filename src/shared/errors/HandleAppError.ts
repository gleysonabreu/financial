import { NextFunction, Request, Response } from 'express';
import { ValidationError as YupValidationError } from 'yup';

import { AppError } from './AppError';

interface IValidationErrors {
  [key: string]: string[];
}

const HandleAppError = async (
  err: Error,
  request: Request,
  response: Response,
  _next: NextFunction,
): Promise<Response> => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err instanceof YupValidationError) {
    const errors: IValidationErrors = {};

    err.inner.forEach(err => {
      if (err.path) errors[err.path] = err.errors;
    });

    return response.status(400).json({
      message: 'Validation fails',
      errors,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: `Internal server error - ${err.message} `,
  });
};

export { HandleAppError };
