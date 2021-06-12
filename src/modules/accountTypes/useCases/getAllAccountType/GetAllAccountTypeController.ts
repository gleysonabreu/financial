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
    return response.json(accountTypes);
  }
}

export { GetAllAccountTypeController };
