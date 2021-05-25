import { AppError } from '@shared/errors/AppError';

export namespace UpdateBillError {
  export class BillNotFound extends AppError {
    constructor() {
      super('Bill not found');
    }
  }

  export class AccountTypeNotFound extends AppError {
    constructor() {
      super('Account type not found');
    }
  }
}
