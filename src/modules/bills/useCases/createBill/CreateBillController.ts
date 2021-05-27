import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateBillUseCase } from './CreateBillUseCase';

class CreateBillController {
  async execute(request: Request, response: Response): Promise<Response> {
    const {
      account_type_id: accountTypeId,
      value,
      justification,
      date,
    } = request.body;

    const createBillUseCase = container.resolve(CreateBillUseCase);
    const bill = await createBillUseCase.execute({
      accountTypeId,
      justification,
      value,
      date,
    });

    return response.json(bill);
  }
}

export { CreateBillController };
