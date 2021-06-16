import { UsersRepository } from '@modules/users/repositories/UsersRepository';
import { NextFunction, Request, Response } from 'express';

import { JWTInvalidTokenError } from '@shared/errors/JWTInvalidTokenError';
import { JWTTokenMissingError } from '@shared/errors/JWTTokenMissingError';
import { verify } from '@shared/services/token';

interface IPayload {
  user: {
    roles: string[];
  };
  sub: string;
}

async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (authHeader) {
    const [, token] = authHeader.split(' ');
    try {
      const { sub: userId, user: userInfo } = (await verify(token)) as IPayload;

      const usersRepository = new UsersRepository();
      const user = await usersRepository.findById(userId);
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
