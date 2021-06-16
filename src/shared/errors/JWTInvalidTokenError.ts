import { AppError } from './AppError';

class JWTInvalidTokenError extends AppError {
  constructor() {
    super('Wrong authentication token!', 401);
  }
}

export { JWTInvalidTokenError };
