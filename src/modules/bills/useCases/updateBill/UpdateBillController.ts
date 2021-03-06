import { BillMapper } from '@modules/bills/mappers/BillMapper';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateBillUseCase } from './UpdateBillUseCase';

class UpdateBillController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const {
      account_type_id: accountTypeId,
      justification,
      value,
    } = request.body;

    const updateBillUseCase = container.resolve(UpdateBillUseCase);
    const bill = await updateBillUseCase.execute({
      accountTypeId,
      id,
      justification,
      value,
    });

    const billView = BillMapper.toDTO(bill);
    return response.json(billView);
  }
}

export { UpdateBillController };
