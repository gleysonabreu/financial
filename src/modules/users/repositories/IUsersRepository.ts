import { User } from '../entities/User';
import { ICreateUserDTO } from '../useCases/createUser/ICreateUserDTO';

interface IUsersRepository {
  create: (user: ICreateUserDTO) => Promise<User>;
  findByEmail: (email: string) => Promise<User | undefined>;
  findById: (id: string) => Promise<User | undefined>;
  findByCpf: (cpf: string) => Promise<User | undefined>;
  findByPhone: (phone: string) => Promise<User | undefined>;
  update: (user: User) => Promise<User>;
}

export { IUsersRepository };
