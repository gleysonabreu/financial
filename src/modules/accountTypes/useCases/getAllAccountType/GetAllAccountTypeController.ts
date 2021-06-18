import { AccountTypeMapper } from '@modules/accountTypes/mappers/AccountTypeMapper';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetAllAccountType } from './GetAllAccountType';

class GetAllAccountTypeController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { name, page = 1, per_page } = request.query;

    const getAllAccountType = container.resolve(GetAllAccountType);
    const { accountTypes, totalAccountTypes } = await getAllAccountType.execute(
      {
        name: name as string,
        page: Number(page),
        per_page: Number(per_page),
      },
    );

    response.header('X-Total-Count', `${totalAccountTypes}`);

    const accountTypesView = AccountTypeMapper.toMany(accountTypes);
    return response.json(accountTypesView);
  }
}

export { GetAllAccountTypeController };
