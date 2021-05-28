import { AppError } from '@shared/errors/AppError';

export namespace ResetPasswordUserError {
  export class TokenInvalid extends AppError {
    constructor() {
      super('Token invalid.');
    }
  }

  export class TokenExpired extends AppError {
    constructor() {
      super('Token expired.');
    }
  }
}
