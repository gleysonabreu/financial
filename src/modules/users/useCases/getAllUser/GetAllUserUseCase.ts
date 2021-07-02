import { IUser } from '@modules/users/DTOS/IUser';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { IGetAllUserDTO } from './IGetAllUserDTO';

interface IResponse {
  users: IUser[];
  totalUsers: number;
}

@injectable()
class GetAllUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ cpf, name, skip, take }: IGetAllUserDTO): Promise<IResponse> {
    const schema = yup.object().shape({
      cpf: yup.string(),
      name: yup.string(),
      per_page: yup.number(),
      page: yup.number(),
    });

    const perPage = take || 0;
    const page = skip ? (skip - 1) * perPage : 0;

    await schema.validate(
      { cpf, name, per_page: perPage, page },
      { abortEarly: false },
    );

    const users = await this.usersRepository.findAll({
      skip: page,
      take: perPage,
      cpf,
      name,
    });

    const totalUsers = (
      await this.usersRepository.findAll({
        cpf,
        name,
      })
    ).length;

    return { users, totalUsers };
  }
}

export { GetAllUserUseCase };
