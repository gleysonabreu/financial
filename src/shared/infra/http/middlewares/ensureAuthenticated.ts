import { ShowUserProfileUseCase } from '@modules/users/useCases/showUserProfile/ShowUserProfileUseCase';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

import { JWTInvalidTokenError } from '@shared/errors/JWTInvalidTokenError';
import { JWTTokenMissingError } from '@shared/errors/JWTTokenMissingError';
import { IJwtResponse, verify } from '@shared/services/token';

async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (authHeader) {
    const [, token] = authHeader.split(' ');
    try {
      const { sub: userId, user: userInfo } = (await verify(
        token,
      )) as IJwtResponse;

      const getUserAuth = container.resolve(ShowUserProfileUseCase);
      const user = await getUserAuth.execute(userId);
      if (user) {
        request.user = {
          id: userId,
          roles: userInfo.roles,
        };

        next();
      } else {
        next(new JWTInvalidTokenError());
      }
    } catch {
      next(new JWTInvalidTokenError());
    }
  } else {
    next(new JWTTokenMissingError());
  }
}

export { ensureAuthenticated };
