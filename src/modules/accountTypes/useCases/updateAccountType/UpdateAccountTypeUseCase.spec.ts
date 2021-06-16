import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { InMemoryAccountTypesRepository } from '@modules/accountTypes/repositories/in-memory/InMemoryAccountTypesRepository';

import { UpdateAccountTypeError } from './UpdateAccountTypeError';
import { UpdateAccountTypeUseCase } from './UpdateAccountTypeUseCase';

let accountTypesRepository: IAccountTypesRepository;
let updateAccountTypeUseCase: UpdateAccountTypeUseCase;

describe('UpdateAccountTypeUseCase', () => {
  beforeEach(() => {
    accountTypesRepository = new InMemoryAccountTypesRepository();
    updateAccountTypeUseCase = new UpdateAccountTypeUseCase(
      accountTypesRepository,
    );
  });

  it('should be able to update a account type', async () => {
    const accountType = await accountTypesRepository.create({
      name: 'test',
    });

    const response = await updateAccountTypeUseCase.execute({
      id: accountType.id,
      name: 'test2',
    });

    expect(response).toEqual(
      expect.objectContaining({
        name: 'test2',
      }),
    );
  });

  it('should not be able to update an account type if the account type does not exist', async () => {
    await expect(async () => {
      await updateAccountTypeUseCase.execute({
        id: '61ee0c5d-5802-4cd4-9c3b-dc921b203bec',
        name: 'test',
      });
    }).rejects.toBeInstanceOf(UpdateAccountTypeError.AccountTypeNotFound);
  });

  it('should not be able to update an account type if the account type name already exists', async () => {
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
      });
    }).rejects.toBeInstanceOf(UpdateAccountTypeError.AccountTypeAlreadyExists);
  });
});
