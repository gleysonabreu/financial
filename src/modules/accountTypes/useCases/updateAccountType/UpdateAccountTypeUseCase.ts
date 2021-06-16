import { AccountType } from '@modules/accountTypes/entities/AccountType';
import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { injectable, inject } from 'tsyringe';
import * as yup from 'yup';

import { IUpdateAccountTypeDTO } from './IUpdateAccountTypeDTO';
import { UpdateAccountTypeError } from './UpdateAccountTypeError';

@injectable()
class UpdateAccountTypeUseCase {
  constructor(
    @inject('AccountTypesRepository')
    private accountTypesRepository: IAccountTypesRepository,
  ) {}

  async execute({ id, name }: IUpdateAccountTypeDTO): Promise<AccountType> {
    const schema = yup.object().shape({
      id: yup.string().uuid().required(),
      name: yup.string().min(3).required(),
    });
    await schema.validate({ id, name }, { abortEarly: false });

    const accountType = await this.accountTypesRepository.findById(id);
    if (!accountType) {
      throw new UpdateAccountTypeError.AccountTypeNotFound();
    }

    const accountTypeByName = await this.accountTypesRepository.findByName(
      name,
    );
    if (accountTypeByName && accountTypeByName.name !== accountType.name) {
      throw new UpdateAccountTypeError.AccountTypeAlreadyExists();
    }

    accountType.name = name;
    const accountTypeUpdate = await this.accountTypesRepository.update(
      accountType,
    );
    return accountTypeUpdate;
  }
}

export { UpdateAccountTypeUseCase };
