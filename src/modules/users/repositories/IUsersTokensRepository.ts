import { ICreateUserTokenDTO } from '@modules/users/DTO/ICreateUserTokenDTO';
import { UserToken } from '@modules/users/entities/UserToken';

interface IUsersTokensRepository {
  create(userToken: ICreateUserTokenDTO): Promise<UserToken>;
  findUserIdAndToken(
    userId: string,
    token: string,
  ): Promise<UserToken | undefined>;
  deleteById(id: string): Promise<void>;
  findByToken(token: string): Promise<UserToken | undefined>;
}

export { IUsersTokensRepository };
