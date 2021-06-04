import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { InMemoryAccountTypesRepository } from '@modules/accountTypes/repositories/in-memory/InMemoryAccountTypesRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import { hash } from '@shared/services/password';

import { GetAllAccountType } from './GetAllAccountType';
import { GetAllAccountTypeError } from './GetAllAccountTypeError';

let usersRepository: IUsersRepository;
let accountTypesRepository: IAccountTypesRepository;
let getAllAccountType: GetAllAccountType;

describe('GetAllAccountType', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    accountTypesRepository = new InMemoryAccountTypesRepository();

    getAllAccountType = new GetAllAccountType(
      usersRepository,
      accountTypesRepository,
    );
  });

  it('should not be able to get all account type if user does not exists', async () => {
    await expect(async () => {
      await getAllAccountType.execute({
        userId: '4c9193aa-b850-4b60-9475-3fd2f82986b8',
      });
    }).rejects.toBeInstanceOf(GetAllAccountTypeError);
  });

  it('should be able to get all account type', async () => {
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

    const accountType = await accountTypesRepository.create({
      name: 'test',
    });

    const response = await getAllAccountType.execute({ userId: user.id });
    expect(response).toEqual([accountType]);
  });
});
