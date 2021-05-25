import { AppError } from '@shared/errors/AppError';

class DeleteBillError extends AppError {
  constructor() {
    super('Bill not found');
  }
}

export { DeleteBillError };
