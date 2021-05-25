import { AppError } from '@shared/errors/AppError';

class IncorrectEmailOrPassword extends AppError {
  constructor() {
    super('Incorrect email or password', 401);
  }
}

export { IncorrectEmailOrPassword };
