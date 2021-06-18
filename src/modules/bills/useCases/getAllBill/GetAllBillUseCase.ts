import { Bill } from '@modules/bills/entities/Bill';
import { IBillsRepository } from '@modules/bills/repositories/IBillsRepository';
import moment from 'moment';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

interface IRequest {
  perPage?: number;
  page?: number;
  justification?: string;
  accountTypeId?: string;
  dateStart?: string;
  dateFinish?: string;
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
    dateFinish,
    dateStart,
  }: IRequest): Promise<IResponse> {
    const schema = yup.object().shape({
      accountTypeId: yup.string().uuid(),
      justification: yup.string(),
      page: yup.number(),
      perPage: yup.number(),
      date_start: yup
        .string()
        .test(
          'Date',
          'Date in invalid format, put in the following format (YYYY-MM-DD)',
          value => {
            if (value) {
              return moment(value, 'YYYY-MM-DD', true).isValid();
            }
            return true;
          },
        ),
      date_finish: yup
        .string()
        .test(
          'Date',
          'Date in invalid format, put in the following format (YYYY-MM-DD)',
          value => {
            if (value) {
              return moment(value, 'YYYY-MM-DD', true).isValid();
            }
            return true;
          },
        ),
    });

    const take = perPage || 0;
    const skip = page ? (page - 1) * take : 0;

    await schema.validate(
      {
        account_type_id: accountTypeId,
        justification,
        page: skip,
        per_page: take,
        date_start: dateStart,
        date_finish: dateFinish,
      },
      { abortEarly: false },
    );

    const bills = await this.billsRepository.findAll({
      take,
      skip,
      justification,
      accountTypeId,
      dateFinish,
      dateStart,
    });

    const totalBills = (
      await this.billsRepository.findAll({
        justification,
        accountTypeId,
        dateFinish,
        dateStart,
      })
    ).length;

    return { bills, totalBills };
  }
}

export { GetAllBillUseCase };
