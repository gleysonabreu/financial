import { BillMapper } from '@modules/bills/mappers/BillMapper';
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
      date_start: dateStart,
      date_finish: dateFinish,
    } = request.query;

    const getAllBillUseCase = container.resolve(GetAllBillUseCase);
    const { bills, totalBills } = await getAllBillUseCase.execute({
      accountTypeId: accountTypeId as string,
      justification: justification as string,
      page: Number(page),
      perPage: Number(perPage),
      dateFinish: dateFinish as string,
      dateStart: dateStart as string,
    });

    response.header('X-Total-Count', `${totalBills}`);

    const billsView = BillMapper.toMany(bills);
    return response.json(billsView);
  }
}

export { GetAllBillController };
