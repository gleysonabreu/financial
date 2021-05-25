import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { Bill } from '@modules/bills/entities/Bill';
import { IBillsRepository } from '@modules/bills/repositories/IBillsRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { CreateBillError } from './CreateBillError';
import { ICreateBillDTO } from './ICreateBillDTO';

@injectable()
class CreateBillUseCase {
  constructor(
    @inject('AccountTypesRepository')
    private accountTypesRepository: IAccountTypesRepository,
    @inject('BillsRepository')
    private billsRepository: IBillsRepository,
  ) {}

  async execute({
    accountTypeId,
    justification,
    value,
  }: ICreateBillDTO): Promise<Bill> {
    const schema = yup.object().shape({
      accountTypeId: yup.string().uuid().required(),
      justification: yup.string().required(),
      value: yup.number().required(),
    });
    await schema.validate(
      { accountTypeId, value, justification },
      { abortEarly: false },
    );

    const accountType = await this.accountTypesRepository.findById(
      accountTypeId,
    );

    if (!accountType) {
      throw new CreateBillError();
    }

    const bill = await this.billsRepository.create({
      accountTypeId,
      justification,
      value,
    });
    return bill;
  }
}

export { CreateBillUseCase };
