import { AppError } from '@shared/errors/AppError';

class DeletePermissionError extends AppError {
  constructor() {
    super('Permission not found');
  }
}

export { DeletePermissionError };
