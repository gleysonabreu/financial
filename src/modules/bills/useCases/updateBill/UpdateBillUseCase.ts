import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { Bill } from '@modules/bills/entities/Bill';
import { IBillsRepository } from '@modules/bills/repositories/IBillsRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { IUpdateBillDTO } from './IUpdateBillDTO';
import { UpdateBillError } from './UpdateBillError';

@injectable()
class UpdateBillUseCase {
  constructor(
    @inject('AccountTypesRepository')
    private accountTypesRepository: IAccountTypesRepository,
    @inject('BillsRepository')
    private billsRepository: IBillsRepository,
  ) {}

  async execute({
    id,
    accountTypeId,
    justification,
    value,
  }: IUpdateBillDTO): Promise<Bill> {
    const schema = yup.object().shape({
      id: yup.string().uuid().required(),
      accountTypeId: yup.string().uuid().required(),
      justification: yup.string().min(10).required(),
      value: yup.number().required(),
    });
    await schema.validate(
      { id, accountTypeId, justification, value },
      { abortEarly: false },
    );

    const billUpdate = await this.billsRepository.findById(id);
    if (!billUpdate) {
      throw new UpdateBillError.BillNotFound();
    }

    const accountType = await this.accountTypesRepository.findById(
      accountTypeId,
    );
    if (!accountType) {
      throw new UpdateBillError.AccountTypeNotFound();
    }

    billUpdate.accountType = accountType;
    billUpdate.justification = justification;
    billUpdate.value = value;

    const bill = await this.billsRepository.save(billUpdate);
    return bill;
  }
}

export { UpdateBillUseCase };
