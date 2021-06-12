import { AppError } from '@shared/errors/AppError';

export class AccountTypeAlreadyExists extends AppError {
  constructor() {
    super('Account type already exists');
  }
}
