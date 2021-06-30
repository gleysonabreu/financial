import { IBill } from '@modules/bills/DTOS/IBill';
import { IBillsRepository } from '@modules/bills/repositories/IBillsRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { GetOneBillError } from './GetOneBillError';

interface IRequest {
  id: string;
}

@injectable()
class GetOneBillUseCase {
  constructor(
    @inject('BillsRepository')
    private billsRepository: IBillsRepository,
  ) {}

  async execute({ id }: IRequest): Promise<IBill> {
    const schema = yup.object().shape({
      id: yup.string().uuid().required(),
    });
    await schema.validate({ id }, { abortEarly: false });

    const bill = await this.billsRepository.findById(id);
    if (!bill) {
      throw new GetOneBillError();
    }

    return bill;
  }
}

export { GetOneBillUseCase };
