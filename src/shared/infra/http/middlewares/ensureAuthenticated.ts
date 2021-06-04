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

  if (!authHeader) {
    throw new JWTTokenMissingError();
  }

  const [, token] = authHeader.split(' ');
  try {
    const { sub: userId, user: userInfo } = (await verify(token)) as IPayload;

    request.user = {
      id: userId,
      roles: userInfo.roles,
    };

    next();
  } catch {
    throw new JWTInvalidTokenError();
  }
}

export { ensureAuthenticated };
