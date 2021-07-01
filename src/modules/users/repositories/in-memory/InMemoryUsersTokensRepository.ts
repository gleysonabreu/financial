import { ICreateUserTokenDTO } from '@modules/users/DTO/ICreateUserTokenDTO';
import { IUserToken } from '@modules/users/DTO/IUserToken';
import { v4 as uuid } from 'uuid';

import { IUsersTokensRepository } from '../IUsersTokensRepository';

class InMemoryUsersTokensRepository implements IUsersTokensRepository {
  private usersTokens: IUserToken[] = [];

  async create({
    expireDate,
    token,
    userId,
  }: ICreateUserTokenDTO): Promise<IUserToken> {
    const userToken = {
      id: uuid(),
      expireDate,
      token,
      userId,
    } as IUserToken;

    this.usersTokens.push(userToken);
    return userToken;
  }

  async findUserIdAndToken(
    userId: string,
    token: string,
  ): Promise<IUserToken | undefined> {
    const userToken = this.usersTokens.find(
      userT => userT.userId === userId && userT.token === token,
    );
    return userToken;
  }

  async findByToken(token: string): Promise<IUserToken | undefined> {
    const userToken = this.usersTokens.find(userT => userT.token === token);
    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    const userToken = this.usersTokens.find(userT => userT.id === id);
    this.usersTokens.splice(this.usersTokens.indexOf(userToken), 1);
  }
}

export { InMemoryUsersTokensRepository };
