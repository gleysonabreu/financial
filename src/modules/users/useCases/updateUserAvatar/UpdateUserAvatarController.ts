import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

class UpdateUserAvatarController {
  async execute(request: Request, response: Response): Promise<Response> {
    const avatarFile = request.file.filename;
    const { id: userId } = request.user;

    const updateAvatarUseCase = container.resolve(UpdateUserAvatarUseCase);
    await updateAvatarUseCase.execute({
      avatarFile,
      userId,
    });

    return response.status(204).send();
  }
}

export { UpdateUserAvatarController };
