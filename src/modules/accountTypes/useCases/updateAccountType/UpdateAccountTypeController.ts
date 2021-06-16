import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateAccountTypeUseCase } from './UpdateAccountTypeUseCase';

class UpdateAccountTypeController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name } = request.body;

    const updateAccountTypeUseCase = container.resolve(
      UpdateAccountTypeUseCase,
    );
    const updateAccountType = await updateAccountTypeUseCase.execute({
      id,
      name,
    });

    return response.json(updateAccountType);
  }
}

export { UpdateAccountTypeController };
