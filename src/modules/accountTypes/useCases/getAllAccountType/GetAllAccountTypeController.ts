import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetAllAccountType } from './GetAllAccountType';

class GetAllAccountTypeController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;

    const getAllAccountType = container.resolve(GetAllAccountType);
    const accountTypes = await getAllAccountType.execute({ userId });

    return response.json(accountTypes);
  }
}

export { GetAllAccountTypeController };
