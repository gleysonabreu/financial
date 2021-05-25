import { AccountType } from '@modules/accountTypes/entities/AccountType';
import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { CreateAccountTypeError } from './CreateAccountTypeError';

interface IRequest {
  name: string;
  userId: string;
}

@injectable()
class CreateAccountTypeUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('AccountTypesRepository')
    private accountTypesRepository: IAccountTypesRepository,
  ) {}
  async execute({ name, userId }: IRequest): Promise<AccountType> {
    const schema = yup.object().shape({
      name: yup.string().required(),
      userId: yup.string().uuid().required(),
    });
    await schema.validate({ name, userId }, { abortEarly: false });

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new CreateAccountTypeError.UserNotFound();
    }

    const accountTypeAlreadyExists = await this.accountTypesRepository.findByName(
      name,
    );
    if (accountTypeAlreadyExists) {
      throw new CreateAccountTypeError.AccountTypeAlreadyExists();
    }

    const accountType = await this.accountTypesRepository.create({ name });
    return accountType;
  }
}

export { CreateAccountTypeUseCase };
