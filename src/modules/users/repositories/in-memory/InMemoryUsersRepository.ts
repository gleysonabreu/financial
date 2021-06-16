import { IGetAllUserDTO } from '@modules/users/useCases/getAllUser/IGetAllUserDTO';

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
    Object.assign(user, {
      ...data,
      permissions: [
        {
          type: data.permission,
        },
      ],
    });
    this.users.push(user);
    return user;
  }

  async update(user: User): Promise<User> {
    const findElement = this.users.findIndex(us => us.id === user.id);
    this.users[findElement].firstName = user.firstName;
    this.users[findElement].lastName = user.lastName;
    this.users[findElement].email = user.email;
    this.users[findElement].cpf = user.cpf;
    this.users[findElement].phone = user.phone;
    this.users[findElement].birthDate = user.birthDate;

    return user;
  }

  async findAll({ cpf, name }: IGetAllUserDTO): Promise<User[]> {
    if (!cpf && !name) {
      return this.users;
    }

    const allUsers = this.users.filter(user => {
      if (
        name &&
        (user.firstName.toLowerCase().includes(name.toLowerCase()) ||
          user.lastName.toLowerCase().includes(name.toLowerCase())) &&
        !cpf
      ) {
        return true;
      }

      if (cpf && user.cpf.includes(cpf) && !name) {
        return true;
      }

      if (
        (cpf && user.cpf.includes(cpf)) ||
        (name &&
          (user.firstName.toLowerCase().includes(name.toLowerCase()) ||
            user.lastName.toLowerCase().includes(name.toLowerCase())))
      ) {
        return true;
      }

      return false;
    });
    return allUsers;
  }

  async remove(user: User): Promise<void> {
    const userData = this.users.find(userInfo => userInfo.id === user.id);
    this.users.splice(this.users.indexOf(userData));
  }
}
