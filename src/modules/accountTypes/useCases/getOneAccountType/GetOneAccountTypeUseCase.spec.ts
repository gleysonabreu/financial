import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { InMemoryAccountTypesRepository } from '@modules/accountTypes/repositories/in-memory/InMemoryAccountTypesRepository';

import { AccountTypeNotFound } from './GetOneAccountTypeError';
import { GetOneAccountTypeUseCase } from './GetOneAccountTypeUseCase';

let accountTypesRepository: IAccountTypesRepository;
let getOneAccountTypeUseCase: GetOneAccountTypeUseCase;

describe('GetOneAccountTypeUseCase', () => {
  beforeEach(() => {
    accountTypesRepository = new InMemoryAccountTypesRepository();
    getOneAccountTypeUseCase = new GetOneAccountTypeUseCase(
      accountTypesRepository,
    );
  });

  it('should be able to get one account type', async () => {
    const accountType = await accountTypesRepository.create({
      name: 'test',
    });

    const response = await getOneAccountTypeUseCase.execute({
      id: accountType.id,
    });

    expect(response).toEqual(
      expect.objectContaining({
        name: 'test',
      }),
    );
  });

  it('should not be able to get one account type if id does not exist', async () => {
    await expect(async () => {
      await getOneAccountTypeUseCase.execute({
        id: '44227519-4ad5-4268-8488-b6adee69e6c3',
      });
    }).rejects.toBeInstanceOf(AccountTypeNotFound);
  });
});
