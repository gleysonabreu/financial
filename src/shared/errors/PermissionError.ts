import { AppError } from './AppError';

class PermissionError extends AppError {
  constructor() {
    super('You do not have permission!', 401);
  }
}

export { PermissionError };
