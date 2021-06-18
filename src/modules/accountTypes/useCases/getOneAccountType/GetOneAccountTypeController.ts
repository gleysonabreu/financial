import { AccountTypeMapper } from '@modules/accountTypes/mappers/AccountTypeMapper';
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

    const accountTypeView = AccountTypeMapper.toDTO(accountType);
    return response.json(accountTypeView);
  }
}

export { GetOneAccountTypeController };
