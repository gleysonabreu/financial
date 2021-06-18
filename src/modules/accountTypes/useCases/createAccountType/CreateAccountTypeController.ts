import { AccountTypeMapper } from '@modules/accountTypes/mappers/AccountTypeMapper';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateAccountTypeUseCase } from './CreateAccountTypeUseCase';

class CreateAccountTypeController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;

    const createAccountTypeUseCase = container.resolve(
      CreateAccountTypeUseCase,
    );
    const accountType = await createAccountTypeUseCase.execute({
      name,
    });

    const accountTypeView = AccountTypeMapper.toDTO(accountType);
    return response.json(accountTypeView);
  }
}

export { CreateAccountTypeController };
