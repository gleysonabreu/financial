import { Bill } from '@modules/bills/entities/Bill';
import { IBillsRepository } from '@modules/bills/repositories/IBillsRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

interface IRequest {
  perPage?: number;
  page?: number;
  justification?: string;
  accountTypeId?: string;
}

interface IResponse {
  bills: Bill[];
  totalBills: number;
}

@injectable()
class GetAllBillUseCase {
  constructor(
    @inject('BillsRepository')
    private billsRepository: IBillsRepository,
  ) {}

  async execute({
    accountTypeId,
    justification,
    page,
    perPage,
  }: IRequest): Promise<IResponse> {
    const schema = yup.object().shape({
      accountTypeId: yup.string().uuid(),
      justification: yup.string(),
      page: yup.number(),
      perPage: yup.number(),
    });

    const take = perPage || 0;
    const skip = page ? (page - 1) * take : 0;

    await schema.validate(
      { accountTypeId, justification, page: skip, perPage: take },
      { abortEarly: false },
    );

    const bills = await this.billsRepository.findAll({
      take,
      skip,
      justification,
      accountTypeId,
    });

    const totalBills = (
      await this.billsRepository.findAll({
        justification,
        accountTypeId,
      })
    ).length;

    return { bills, totalBills };
  }
}

export { GetAllBillUseCase };
