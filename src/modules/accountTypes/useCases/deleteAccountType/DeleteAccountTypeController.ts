import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DeleteAccountTypeUseCase } from './DeleteAccountTypeUseCase';

class DeleteAccountTypeController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;
    const { id } = request.params;

    const deleteAccountTypeUseCase = container.resolve(
      DeleteAccountTypeUseCase,
    );
    await deleteAccountTypeUseCase.execute({
      id,
      userId,
    });

    return response.status(204).send();
  }
}

export { DeleteAccountTypeController };
