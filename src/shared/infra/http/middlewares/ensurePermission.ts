import { permissions } from '@config/permissions';
import { NextFunction, Request, Response } from 'express';

import { PermissionError } from '../../../errors/PermissionError';

const ensurePermission = (authorizedPermissions: string[] = []) => {
  return async (
    request: Request,
    _response: Response,
    next: NextFunction,
  ): Promise<void> => {
    const allPermissions = [permissions.ADMIN, ...authorizedPermissions];

    const verifyPermission = request.user.roles.some(role =>
      allPermissions.includes(role),
    );

    if (!verifyPermission) {
      throw new PermissionError();
    }

    next();
  };
};

export { ensurePermission };
