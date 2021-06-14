import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from './CreateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let usersRepository: IUsersRepository;

describe('CreateUserUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should be able to create a user', async () => {
    const response = await createUserUseCase.execute({
      firstName: 'Testing',
      lastName: 'Test again',
      email: 'test@test.com',
      password: '1234567',
      birthDate: '1990-02-25',
      cpf: '00000000000',
      phone: '00000000000',
      permission: 'ADMIN',
    });

    expect(response).toHaveProperty('id');
  });

  it('should not be able to create a user if permission does not exist', async () => {
    await expect(async () => {
      await createUserUseCase.execute({
        firstName: 'Testing',
        lastName: 'Test again',
        email: 'test@test.com',
        password: '1234567',
        birthDate: '1990-02-25',
        cpf: '00000000000',
        phone: '00000000000',
        permission: 'Any',
      });
    }).rejects.toBeInstanceOf(CreateUserError.PermissionNotExist);
  });

  it('should not be able to create a user with email already exists', async () => {
    await expect(async () => {
      await createUserUseCase.execute({
        firstName: 'Testing',
        lastName: 'Test again',
        email: 'test@test.com',
        password: '1234567',
        birthDate: '1990-02-25',
        cpf: '00000000000',
        phone: '00000000000',
        permission: 'ADMIN',
      });

      await createUserUseCase.execute({
        firstName: 'Testing',
        lastName: 'Test again',
        email: 'test@test.com',
        password: '1234567',
        birthDate: '1990-02-25',
        cpf: '00000000001',
        phone: '00000000001',
        permission: 'ADMIN',
      });
    }).rejects.toBeInstanceOf(CreateUserError.EmailAlreadyExists);
  });

  it('should not be able to create a user with phone already exists', async () => {
    await expect(async () => {
      await createUserUseCase.execute({
        firstName: 'Testing',
        lastName: 'Test again',
        email: 'test@test.com',
        password: '1234567',
        birthDate: '1990-02-25',
        cpf: '00000000000',
        phone: '00000000000',
        permission: 'ADMIN',
      });

      await createUserUseCase.execute({
        firstName: 'Testing',
        lastName: 'Test again',
        email: 'test1@test.com',
        password: '1234567',
        birthDate: '1990-02-25',
        cpf: '00000000001',
        phone: '00000000000',
        permission: 'ADMIN',
      });
    }).rejects.toBeInstanceOf(CreateUserError.PhoneAlreadyExists);
  });

  it('should not be able to create a user with cpf already exists', async () => {
    await expect(async () => {
      await createUserUseCase.execute({
        firstName: 'Testing',
        lastName: 'Test again',
        email: 'test@test.com',
        password: '1234567',
        birthDate: '1990-02-25',
        cpf: '00000000000',
        phone: '00000000000',
        permission: 'ADMIN',
      });

      await createUserUseCase.execute({
        firstName: 'Testing',
        lastName: 'Test again',
        email: 'test1@test.com',
        password: '1234567',
        birthDate: '1990-02-25',
        cpf: '00000000000',
        phone: '00000000002',
        permission: 'ADMIN',
      });
    }).rejects.toBeInstanceOf(CreateUserError.CpfAlreadyExists);
  });
});
