import { AppError } from './AppError';

class JWTTokenMissingError extends AppError {
  constructor() {
    super('JWT token is missing!', 401);
  }
}

export { JWTTokenMissingError };
