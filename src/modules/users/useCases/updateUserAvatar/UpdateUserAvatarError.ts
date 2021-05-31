import { AppError } from '@shared/errors/AppError';

class UpdateUserAvatarError extends AppError {
  constructor() {
    super('User not found');
  }
}

export { UpdateUserAvatarError };
