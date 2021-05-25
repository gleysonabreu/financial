import { AppError } from '@shared/errors/AppError';

export namespace DeleteAccountTypeError {
  export class UserNotFound extends AppError {
    constructor() {
      super('User not found.');
    }
  }

  export class AccountTypeNotFound extends AppError {
    constructor() {
      super('Account type not found.');
    }
  }
}
