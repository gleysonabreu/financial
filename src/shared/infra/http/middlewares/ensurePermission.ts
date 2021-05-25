import { financialEnv } from '@config/financialEnv';
import { NextFunction, Request, Response } from 'express';

import { PermissionError } from '../../../errors/PermissionError';

const ensurePermission = (permissions: number[] = []) => {
  return async (
    request: Request,
    _response: Response,
    next: NextFunction,
  ): Promise<void> => {
    const allPermissions = [
      financialEnv.financialAdminPermission,
      ...permissions,
    ];

    const verifyPermission = request.user.roles.map(role => {
      if (allPermissions.includes(role)) {
        return true;
      }

      return false;
    });

    if (!verifyPermission.includes(true)) {
      throw new PermissionError();
    }

    next();
  };
};

export { ensurePermission };
