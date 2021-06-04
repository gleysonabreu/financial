import { AppError } from '@shared/errors/AppError';

export namespace CreateUserError {
  export class EmailAlreadyExists extends AppError {
    constructor() {
      super('Email already exists');
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

  export class PermissionNotExist extends AppError {
    constructor() {
      super('Permission does not exist.');
    }
  }
}
