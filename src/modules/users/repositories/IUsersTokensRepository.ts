import { ICreateUserTokenDTO } from '@modules/users/DTO/ICreateUserTokenDTO';

import { IUserToken } from '../DTO/IUserToken';

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
