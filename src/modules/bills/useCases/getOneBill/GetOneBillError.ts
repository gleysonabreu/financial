import { AppError } from '@shared/errors/AppError';

class GetOneBillError extends AppError {
  constructor() {
    super('Bill not found');
  }
}

export { GetOneBillError };
