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
