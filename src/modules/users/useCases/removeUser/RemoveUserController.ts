import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { RemoveUserUseCase } from './RemoveUserUseCase';

class RemoveUserController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.params;

    const removeUserUseCase = container.resolve(RemoveUserUseCase);
    await removeUserUseCase.execute({
      userId,
    });

    return response.send();
  }
}

export { RemoveUserController };
