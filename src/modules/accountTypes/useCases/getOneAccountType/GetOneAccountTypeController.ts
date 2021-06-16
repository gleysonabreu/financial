import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetOneAccountTypeUseCase } from './GetOneAccountTypeUseCase';

class GetOneAccountTypeController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const getOneAccountTypeUseCase = container.resolve(
      GetOneAccountTypeUseCase,
    );
    const accountType = await getOneAccountTypeUseCase.execute({
      id,
    });

    return response.json(accountType);
  }
}

export { GetOneAccountTypeController };
