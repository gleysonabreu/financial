import { IBillsRepository } from '@modules/bills/repositories/IBillsRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { DeleteBillError } from './DeleteBillError';

interface IRequest {
  id: string;
}

@injectable()
class DeleteBillUseCase {
  constructor(
    @inject('BillsRepository')
    private billsRepository: IBillsRepository,
  ) {}

  async execute({ id }: IRequest): Promise<void> {
    const schema = yup.object().shape({
      id: yup.string().uuid().required(),
    });
    await schema.validate({ id }, { abortEarly: false });

    const bill = await this.billsRepository.findById(id);
    if (!bill) {
      throw new DeleteBillError();
    }

    await this.billsRepository.delete(bill);
  }
}

export { DeleteBillUseCase };
