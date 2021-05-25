import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { InMemoryAccountTypesRepository } from '@modules/accountTypes/repositories/in-memory/InMemoryAccountTypesRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import { hash } from '@shared/services/password';

import { UpdateAccountTypeError } from './UpdateAccountTypeError';
import { UpdateAccountTypeUseCase } from './UpdateAccountTypeUseCase';

let usersRepository: IUsersRepository;
let accountTypesRepository: IAccountTypesRepository;
let updateAccountTypeUseCase: UpdateAccountTypeUseCase;

describe('UpdateAccountTypeUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    accountTypesRepository = new InMemoryAccountTypesRepository();
    updateAccountTypeUseCase = new UpdateAccountTypeUseCase(
      usersRepository,
      accountTypesRepository,
    );
  });

  it('should be able to update a account type', async () => {
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

    const accountType = await accountTypesRepository.create({
      name: 'test',
    });

    const response = await updateAccountTypeUseCase.execute({
      id: accountType.id,
      name: 'test2',
      userId: user.id,
    });

    expect(response).toEqual(
      expect.objectContaining({
        name: 'test2',
      }),
    );
  });

  it('should not be able to update an account type if the user does not exist', async () => {
    const accountType = await accountTypesRepository.create({
      name: 'test',
    });

    await expect(async () => {
      await updateAccountTypeUseCase.execute({
        id: accountType.id,
        name: 'test',
        userId: '61ee0c5d-5802-4cd4-9c3b-dc921b203bec',
      });
    }).rejects.toBeInstanceOf(UpdateAccountTypeError.UserNotFound);
  });

  it('should not be able to update an account type if the account type does not exist', async () => {
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

    await expect(async () => {
      await updateAccountTypeUseCase.execute({
        id: '61ee0c5d-5802-4cd4-9c3b-dc921b203bec',
        name: 'test',
        userId: user.id,
      });
    }).rejects.toBeInstanceOf(UpdateAccountTypeError.AccountTypeNotFound);
  });

  it('should not be able to update an account type if the account type name already exists', async () => {
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

    await accountTypesRepository.create({
      name: 'test',
    });

    const accountType = await accountTypesRepository.create({
      name: 'test2',
    });

    await expect(async () => {
      await updateAccountTypeUseCase.execute({
        id: accountType.id,
        name: 'test',
        userId: user.id,
      });
    }).rejects.toBeInstanceOf(UpdateAccountTypeError.AccountTypeAlreadyExists);
  });
});
