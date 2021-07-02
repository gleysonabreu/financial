import { getRepository, Repository } from 'typeorm';

import { ICreateUserTokenDTO } from '../../../DTOS/ICreateUserTokenDTO';
import { IUsersTokensRepository } from '../../../repositories/IUsersTokensRepository';
import { UserToken } from '../entities/UserToken';

class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UserToken>;

  constructor() {
    this.repository = getRepository(UserToken);
  }

  async create({
    expireDate,
    token,
    userId,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = this.repository.create({ expireDate, userId, token });
    await this.repository.save(userToken);

    return userToken;
  }

  async findUserIdAndToken(
    userId: string,
    token: string,
  ): Promise<UserToken | undefined> {
    const userToken = await this.repository.findOne({ userId, token });
    return userToken;
  }

  async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.repository.findOne({ token });
    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { UsersTokensRepository };
