import { getRepository, Repository } from 'typeorm';

import { User } from '../entities/User';
import { ICreateUserDTO } from '../useCases/createUser/ICreateUserDTO';
import { IGetAllUserDTO } from '../useCases/getAllUser/IGetAllUserDTO';
import { IUsersRepository } from './IUsersRepository';

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({ email });
  }

  async create({
    birthDate,
    cpf,
    email,
    firstName,
    password,
    lastName,
    phone,
    permission,
  }: ICreateUserDTO): Promise<User> {
    const user = this.repository.create({
      birthDate,
      cpf,
      email,
      firstName,
      password,
      lastName,
      phone,
      permissions: [
        {
          type: permission,
        },
      ],
    });
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

  async findAll({ cpf, name, skip, take }: IGetAllUserDTO): Promise<User[]> {
    const usersQuery = await this.repository
      .createQueryBuilder('user')
      .skip(skip)
      .take(take);

    if (cpf) {
      usersQuery.orWhere('cpf LIKE :cpf', { cpf: `%${cpf}%` });
    }

    if (name) {
      usersQuery.orWhere(
        'first_name LIKE :first_name OR last_name LIKE :last_name',
        {
          first_name: `%${name}%`,
          last_name: `%${name}%`,
        },
      );
    }

    const users = await usersQuery.getMany();
    return users;
  }

  async remove(user: User): Promise<void> {
    await this.repository.remove(user);
  }
}

export { UsersRepository };
