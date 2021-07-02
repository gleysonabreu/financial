import { IUser } from '../DTOS/IUser';
import { ICreateUserDTO } from '../useCases/createUser/ICreateUserDTO';
import { IGetAllUserDTO } from '../useCases/getAllUser/IGetAllUserDTO';

interface IUsersRepository {
  create: (user: ICreateUserDTO) => Promise<IUser>;
  findByEmail: (email: string) => Promise<IUser | undefined>;
  findById: (id: string) => Promise<IUser | undefined>;
  findByCpf: (cpf: string) => Promise<IUser | undefined>;
  findByPhone: (phone: string) => Promise<IUser | undefined>;
  findAll(filters?: IGetAllUserDTO): Promise<IUser[]>;
  update: (user: IUser) => Promise<IUser>;
  remove: (user: IUser) => Promise<void>;
}

export { IUsersRepository };
