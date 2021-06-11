import { AccountType } from '@modules/accountTypes/entities/AccountType';
import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { GetAllAccountTypeError } from './GetAllAccountTypeError';
import { IGetAllAccountTypeDTO } from './IGetAllAccountTypeDTO';

type IResponse = {
  accountTypes: AccountType[];
  totalAccountTypes: number;
};
@injectable()
class GetAllAccountType {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('AccountTypesRepository')
    private accountTypesRepository: IAccountTypesRepository,
  ) {}

  async execute({
    userId,
    name,
    page,
    per_page: perPage,
  }: IGetAllAccountTypeDTO): Promise<IResponse> {
    const schema = yup.object().shape({
      userId: yup.string().uuid().required(),
      name: yup.string(),
      page: yup.number(),
      per_page: yup.number(),
    });

    const take = perPage || 0;
    const skip = page ? (page - 1) * take : 0;

    await schema.validate(
      { userId, page: skip, name, per_page: take },
      { abortEarly: false },
    );

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new GetAllAccountTypeError();
    }

    const accountTypes = await this.accountTypesRepository.findAll({
      name,
      page: skip,
      per_page: take,
    });

    const totalAccountTypes = (
      await this.accountTypesRepository.findAll({
        name,
      })
    ).length;

    return { accountTypes, totalAccountTypes };
  }
}

export { GetAllAccountType };
