import { AppError } from '@shared/errors/AppError';

class RemoveUserError extends AppError {
  constructor() {
    super('User does not exist');
  }
}

export { RemoveUserError };
