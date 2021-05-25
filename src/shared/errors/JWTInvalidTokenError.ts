import { AppError } from './AppError';

class JWTInvalidTokenError extends AppError {
  constructor() {
    super('JWT invalid token!', 401);
  }
}

export { JWTInvalidTokenError };
