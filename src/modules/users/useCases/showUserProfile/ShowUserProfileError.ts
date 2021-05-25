import { AppError } from '@shared/errors/AppError';

class ShowUserProfileError extends AppError {
  constructor() {
    super('User not found.', 404);
  }
}

export { ShowUserProfileError };
