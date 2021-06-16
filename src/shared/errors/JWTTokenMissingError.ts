import { AppError } from './AppError';

class JWTTokenMissingError extends AppError {
  constructor() {
    super('Token not provided!', 401);
  }
}

export { JWTTokenMissingError };
