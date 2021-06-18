import { PermissionMapper } from '@modules/permissions/mappers/PermissionMapper';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreatePermissionsUseCase } from './CreatePermissionsUseCase';

class CreatePermissionController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { user_id: userId, type } = request.body;

    const createPermissionUseCase = container.resolve(CreatePermissionsUseCase);
    const permission = await createPermissionUseCase.execute({
      userId,
      type,
    });

    const permissionView = PermissionMapper.toDTO(permission);
    return response.json(permissionView);
  }
}

export { CreatePermissionController };
