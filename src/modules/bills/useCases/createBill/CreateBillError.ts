import { AppError } from '@shared/errors/AppError';

class CreateBillError extends AppError {
  constructor() {
    super('Account type not found');
  }
}

export { CreateBillError };
