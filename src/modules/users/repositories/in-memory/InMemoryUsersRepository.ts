import { User } from '../../entities/User';
import { ICreateUserDTO } from '../../useCases/createUser/ICreateUserDTO';
import { IUsersRepository } from '../IUsersRepository';

export class InMemoryUsersRepository implements IUsersRepository {
  private users: User[] = [];

  async findByCpf(cpf: string): Promise<User | undefined> {
    return this.users.find(user => user.cpf === cpf);
  }

  async findByPhone(phone: string): Promise<User | undefined> {
    return this.users.find(user => user.cpf === phone);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async findById(user_id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === user_id);
  }

  async create(data: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, data);
    this.users.push(user);
    return user;
  }

  async update(user: User): Promise<User> {
    const users = this.users.map(us => {
      if (us.id === user.id) {
        return user;
      }
      return us;
    });
    this.users = users;
    return user;
  }
}
