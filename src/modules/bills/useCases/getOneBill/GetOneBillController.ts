import { BillMapper } from '@modules/bills/mappers/BillMapper';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetOneBillUseCase } from './GetOneBillUseCase';

class GetOneBillController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const getOneBillUseCase = container.resolve(GetOneBillUseCase);
    const bill = await getOneBillUseCase.execute({ id });

    const billView = BillMapper.toDTO(bill);
    return response.json(billView);
  }
}

export { GetOneBillController };
