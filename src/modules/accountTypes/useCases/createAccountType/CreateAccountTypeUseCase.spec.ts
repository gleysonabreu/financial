import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { InMemoryAccountTypesRepository } from '@modules/accountTypes/repositories/in-memory/InMemoryAccountTypesRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import { hash } from '@shared/services/password';

import { CreateAccountTypeError } from './CreateAccountTypeError';
import { CreateAccountTypeUseCase } from './CreateAccountTypeUseCase';

let usersRepository: IUsersRepository;
let accountTypesRepository: IAccountTypesRepository;
let createAccountTypeUseCase: CreateAccountTypeUseCase;

describe('CreateAccountTypeUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    accountTypesRepository = new InMemoryAccountTypesRepository();
    createAccountTypeUseCase = new CreateAccountTypeUseCase(
      usersRepository,
      accountTypesRepository,
    );
  });

  it('should be able to create a account type', async () => {
    const user = await usersRepository.create({
      birthDate: '2020-02-15',
      cpf: '00000000000',
      email: 'test@test.com',
      firstName: 'Testing',
      lastName: 'Test',
      password: await hash('1234567'),
      phone: '00000000000',
      permissions: [
        {
          type: 1,
        },
      ],
    });

    const response = await createAccountTypeUseCase.execute({
      name: 'payment',
      userId: user.id,
    });

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('name');
  });

  it('should not be able to create a account type if user does not exist.', async () => {
    await expect(async () => {
      await createAccountTypeUseCase.execute({
        name: 'test',
        userId: 'e28bcd9c-2cc6-4e58-8fe6-000679239a25',
      });
    }).rejects.toBeInstanceOf(CreateAccountTypeError.UserNotFound);
  });

  it('should not be able to create a account type if name already exists', async () => {
    const user = await usersRepository.create({
      birthDate: '2020-02-15',
      cpf: '00000000000',
      email: 'test@test.com',
      firstName: 'Testing',
      lastName: 'Test',
      password: await hash('1234567'),
      phone: '00000000000',
      permissions: [
        {
          type: 1,
        },
      ],
    });
    await createAccountTypeUseCase.execute({
      name: 'test',
      userId: user.id,
    });

    await expect(async () => {
      await createAccountTypeUseCase.execute({
        name: 'test',
        userId: user.id,
      });
    }).rejects.toBeInstanceOf(CreateAccountTypeError.AccountTypeAlreadyExists);
  });
});
