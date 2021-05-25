import { AppError } from '@shared/errors/AppError';

export namespace UpdateUserUseCaseError {
  export class EmailAlreadyExistsError extends AppError {
    constructor() {
      super('E-mail already exists.');
    }
  }

  export class UpdateUserNotFound extends AppError {
    constructor() {
      super('User not found.');
    }
  }

  export class PhoneAlreadyExists extends AppError {
    constructor() {
      super('Phone already exists');
    }
  }

  export class CpfAlreadyExists extends AppError {
    constructor() {
      super('CPF already exists');
    }
  }
}
