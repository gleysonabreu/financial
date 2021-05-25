import { AppError } from '@shared/errors/AppError';

class GetAllAccountTypeError extends AppError {
  constructor() {
    super('User not found');
  }
}

export { GetAllAccountTypeError };
