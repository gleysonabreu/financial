import { AccountType } from '@modules/accountTypes/entities/AccountType';
import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { GetOneAccountTypeError } from './GetOneAccountTypeError';
import { IGetOneAccountType } from './IGetOneAccountType';

@injectable()
class GetOneAccountTypeUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('AccountTypesRepository')
    private accountTypesRepository: IAccountTypesRepository,
  ) {}

  async execute({ userId, id }: IGetOneAccountType): Promise<AccountType> {
    const schema = yup.object().shape({
      userId: yup.string().uuid().required(),
      id: yup.string().uuid().required(),
    });
    await schema.validate({ userId, id }, { abortEarly: false });

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new GetOneAccountTypeError.UserNotFound();
    }

    const accountType = await this.accountTypesRepository.findById(id);
    if (!accountType) {
      throw new GetOneAccountTypeError.AccountTypeNotFound();
    }

    return accountType;
  }
}

export { GetOneAccountTypeUseCase };
