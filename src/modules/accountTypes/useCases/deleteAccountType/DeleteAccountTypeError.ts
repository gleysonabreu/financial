import { AppError } from '@shared/errors/AppError';

export class AccountTypeNotFound extends AppError {
  constructor() {
    super('Account type not found.');
  }
}
