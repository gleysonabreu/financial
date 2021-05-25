import { getRepository, Repository } from 'typeorm';

import { User } from '../entities/User';
import { ICreateUserDTO } from '../useCases/createUser/ICreateUserDTO';
import { IUsersRepository } from './IUsersRepository';

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({ email });
  }

  async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.repository.findOne(id);
  }

  async update(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async findByPhone(phone: string): Promise<User | undefined> {
    return this.repository.findOne({ phone });
  }

  async findByCpf(cpf: string): Promise<User | undefined> {
    return this.repository.findOne({ cpf });
  }
}

export { UsersRepository };
