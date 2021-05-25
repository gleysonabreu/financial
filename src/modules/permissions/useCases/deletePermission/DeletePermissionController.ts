import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DeletePermissionUseCase } from './DeletePermissionUseCase';

class DeletePermissionController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deletePermissionUseCase = container.resolve(DeletePermissionUseCase);
    await deletePermissionUseCase.execute({ id });

    return response.status(204).send();
  }
}

export { DeletePermissionController };
