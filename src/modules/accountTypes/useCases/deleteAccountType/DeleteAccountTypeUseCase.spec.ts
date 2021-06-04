import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { InMemoryAccountTypesRepository } from '@modules/accountTypes/repositories/in-memory/InMemoryAccountTypesRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import { hash } from '@shared/services/password';

import { DeleteAccountTypeError } from './DeleteAccountTypeError';
import { DeleteAccountTypeUseCase } from './DeleteAccountTypeUseCase';

let usersRepository: IUsersRepository;
let accountTypesRepository: IAccountTypesRepository;
let deleteAccountTypeUseCase: DeleteAccountTypeUseCase;

describe('DeleteAccountTypeUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    accountTypesRepository = new InMemoryAccountTypesRepository();
    deleteAccountTypeUseCase = new DeleteAccountTypeUseCase(
      usersRepository,
      accountTypesRepository,
    );
  });

  it('should be able to delete a account type', async () => {
    const user = await usersRepository.create({
      birthDate: '2020-02-15',
      cpf: '00000000000',
      email: 'test@test.com',
      firstName: 'Testing',
      lastName: 'Test',
      password: await hash('1234567'),
      permission: 'ADMIN',
      phone: '00000000000',
    });
    const accountType = await accountTypesRepository.create({
      name: 'test',
    });

    const response = await deleteAccountTypeUseCase.execute({
      id: accountType.id,
      userId: user.id,
    });

    expect(response).toBeUndefined();
  });

  it('should not be able to delete a account type if id not exists', async () => {
    const user = await usersRepository.create({
      birthDate: '2020-02-15',
      cpf: '00000000000',
      email: 'test@test.com',
      firstName: 'Testing',
      lastName: 'Test',
      password: await hash('1234567'),
      permission: 'ADMIN',
      phone: '00000000000',
    });

    await expect(async () => {
      await deleteAccountTypeUseCase.execute({
        id: '3d687d29-9a0d-4b2b-8012-f151682a661f',
        userId: user.id,
      });
    }).rejects.toBeInstanceOf(DeleteAccountTypeError.AccountTypeNotFound);
  });

  it('should not be able to delete a account type if user does not exist', async () => {
    const accountType = await accountTypesRepository.create({
      name: 'test',
    });

    await expect(async () => {
      await deleteAccountTypeUseCase.execute({
        id: accountType.id,
        userId: '3d687d29-9a0d-4b2b-8012-f151682a661f',
      });
    }).rejects.toBeInstanceOf(DeleteAccountTypeError.UserNotFound);
  });
});
