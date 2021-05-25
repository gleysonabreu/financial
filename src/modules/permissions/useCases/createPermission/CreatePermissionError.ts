import { AppError } from '@shared/errors/AppError';

export namespace CreatePermissionError {
  export class UserNotFound extends AppError {
    constructor() {
      super('User not found');
    }
  }

  export class PermissionAlreadyExistsError extends AppError {
    constructor() {
      super('Permission already exists for this user');
    }
  }
}
