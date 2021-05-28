import { AppError } from '@shared/errors/AppError';

class SendForgotPasswordError extends AppError {
  constructor() {
    super('User does not exists!');
  }
}

export { SendForgotPasswordError };
