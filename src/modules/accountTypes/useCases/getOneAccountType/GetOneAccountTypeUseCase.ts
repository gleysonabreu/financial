import { AccountType } from '@modules/accountTypes/entities/AccountType';
import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { AccountTypeNotFound } from './GetOneAccountTypeError';
import { IGetOneAccountType } from './IGetOneAccountType';

@injectable()
class GetOneAccountTypeUseCase {
  constructor(
    @inject('AccountTypesRepository')
    private accountTypesRepository: IAccountTypesRepository,
  ) {}

  async execute({ id }: IGetOneAccountType): Promise<AccountType> {
    const schema = yup.object().shape({
      id: yup.string().uuid().required(),
    });
    await schema.validate({ id }, { abortEarly: false });

    const accountType = await this.accountTypesRepository.findById(id);
    if (!accountType) {
      throw new AccountTypeNotFound();
    }

    return accountType;
  }
}

export { GetOneAccountTypeUseCase };
