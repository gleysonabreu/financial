import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { InMemoryAccountTypesRepository } from '@modules/accountTypes/repositories/in-memory/InMemoryAccountTypesRepository';

import { AccountTypeNotFound } from './DeleteAccountTypeError';
import { DeleteAccountTypeUseCase } from './DeleteAccountTypeUseCase';

let accountTypesRepository: IAccountTypesRepository;
let deleteAccountTypeUseCase: DeleteAccountTypeUseCase;

describe('DeleteAccountTypeUseCase', () => {
  beforeEach(() => {
    accountTypesRepository = new InMemoryAccountTypesRepository();
    deleteAccountTypeUseCase = new DeleteAccountTypeUseCase(
      accountTypesRepository,
    );
  });

  it('should be able to delete a account type', async () => {
    const accountType = await accountTypesRepository.create({
      name: 'test',
    });

    const response = await deleteAccountTypeUseCase.execute({
      id: accountType.id,
    });

    expect(response).toBeUndefined();
  });

  it('should not be able to delete a account type if id not exists', async () => {
    await expect(async () => {
      await deleteAccountTypeUseCase.execute({
        id: '3d687d29-9a0d-4b2b-8012-f151682a661f',
      });
    }).rejects.toBeInstanceOf(AccountTypeNotFound);
  });
});
