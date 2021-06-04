import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { InMemoryAccountTypesRepository } from '@modules/accountTypes/repositories/in-memory/InMemoryAccountTypesRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import { hash } from '@shared/services/password';

import { GetOneAccountTypeError } from './GetOneAccountTypeError';
import { GetOneAccountTypeUseCase } from './GetOneAccountTypeUseCase';

let usersRepository: IUsersRepository;
let accountTypesRepository: IAccountTypesRepository;
let getOneAccountTypeUseCase: GetOneAccountTypeUseCase;

describe('GetOneAccountTypeUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    accountTypesRepository = new InMemoryAccountTypesRepository();
    getOneAccountTypeUseCase = new GetOneAccountTypeUseCase(
      usersRepository,
      accountTypesRepository,
    );
  });

  it('should be able to get one account type', async () => {
    const accountType = await accountTypesRepository.create({
      name: 'test',
    });
    const user = await usersRepository.create({
      birthDate: '2020-02-15',
      cpf: '00000000000',
      email: 'test@test.com',
      firstName: 'Testing',
      lastName: 'Test',
      password: await hash('1234567'),
      phone: '00000000000',
      permission: 'ADMIN',
    });

    const response = await getOneAccountTypeUseCase.execute({
      userId: user.id,
      id: accountType.id,
    });

    expect(response).toEqual(
      expect.objectContaining({
        name: 'test',
      }),
    );
  });

  it('should not be able to get one account type if user does not exist', async () => {
    const accountType = await accountTypesRepository.create({
      name: 'test',
    });

    await expect(async () => {
      await getOneAccountTypeUseCase.execute({
        id: accountType.id,
        userId: '44227519-4ad5-4268-8488-b6adee69e6c3',
      });
    }).rejects.toBeInstanceOf(GetOneAccountTypeError.UserNotFound);
  });

  it('should not be able to get one account type if id does not exist', async () => {
    const user = await usersRepository.create({
      birthDate: '2020-02-15',
      cpf: '00000000000',
      email: 'test@test.com',
      firstName: 'Testing',
      lastName: 'Test',
      password: await hash('1234567'),
      phone: '00000000000',
      permission: 'ADMIN',
    });

    await expect(async () => {
      await getOneAccountTypeUseCase.execute({
        userId: user.id,
        id: '44227519-4ad5-4268-8488-b6adee69e6c3',
      });
    }).rejects.toBeInstanceOf(GetOneAccountTypeError.AccountTypeNotFound);
  });
});
