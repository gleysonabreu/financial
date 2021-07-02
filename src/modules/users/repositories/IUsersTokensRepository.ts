import { ICreateUserTokenDTO } from '@modules/users/DTOS/ICreateUserTokenDTO';

import { IUserToken } from '../DTOS/IUserToken';

interface IUsersTokensRepository {
  create(userToken: ICreateUserTokenDTO): Promise<IUserToken>;
  findUserIdAndToken(
    userId: string,
    token: string,
  ): Promise<IUserToken | undefined>;
  deleteById(id: string): Promise<void>;
  findByToken(token: string): Promise<IUserToken | undefined>;
}

export { IUsersTokensRepository };
