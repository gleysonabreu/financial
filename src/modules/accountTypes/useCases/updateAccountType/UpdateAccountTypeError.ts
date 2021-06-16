import { AppError } from '@shared/errors/AppError';

export namespace UpdateAccountTypeError {
  export class AccountTypeNotFound extends AppError {
    constructor() {
      super('Account type not found');
    }
  }

  export class AccountTypeAlreadyExists extends AppError {
    constructor() {
      super('Account type already exists');
    }
  }
}
