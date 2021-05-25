import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetOneBillUseCase } from './GetOneBillUseCase';

class GetOneBillController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const getOneBillUseCase = container.resolve(GetOneBillUseCase);
    const bill = await getOneBillUseCase.execute({ id });

    return response.json(bill);
  }
}

export { GetOneBillController };
