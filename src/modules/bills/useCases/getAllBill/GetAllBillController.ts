import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetAllBillUseCase } from './GetAllBillUseCase';

class GetAllBillController {
  async execute(request: Request, response: Response): Promise<Response> {
    const {
      account_type_id: accountTypeId,
      justification,
      page = 1,
      per_page: perPage,
    } = request.query;

    const getAllBillUseCase = container.resolve(GetAllBillUseCase);
    const { bills, totalBills } = await getAllBillUseCase.execute({
      accountTypeId: accountTypeId as string,
      justification: justification as string,
      page: Number(page),
      perPage: Number(perPage),
    });

    response.header('X-Total-Count', `${totalBills}`);
    return response.json(bills);
  }
}

export { GetAllBillController };
