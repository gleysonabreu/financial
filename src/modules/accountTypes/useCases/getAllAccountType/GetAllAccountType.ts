import { AccountType } from '@modules/accountTypes/entities/AccountType';
import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { GetAllAccountTypeError } from './GetAllAccountTypeError';
import { IGetAllAccountTypeDTO } from './IGetAllAccountTypeDTO';

@injectable()
class GetAllAccountType {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('AccountTypesRepository')
    private accountTypesRepository: IAccountTypesRepository,
  ) {}

  async execute({ userId }: IGetAllAccountTypeDTO): Promise<AccountType[]> {
    const schema = yup.object().shape({
      userId: yup.string().uuid().required(),
    });
    await schema.validate({ userId }, { abortEarly: false });

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new GetAllAccountTypeError();
    }

    const accountTypes = await this.accountTypesRepository.findAll();
    return accountTypes;
  }
}

export { GetAllAccountType };
