import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateAccountTypeUseCase } from './CreateAccountTypeUseCase';

class CreateAccountTypeController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;

    const createAccountTypeUseCase = container.resolve(
      CreateAccountTypeUseCase,
    );
    await createAccountTypeUseCase.execute({
      name,
    });

    return response.status(204).send();
  }
}

export { CreateAccountTypeController };
