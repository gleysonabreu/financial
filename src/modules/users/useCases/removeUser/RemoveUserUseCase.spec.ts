import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import { hash } from '@shared/services/password';

import { RemoveUserError } from './RemoveUserError';
import { RemoveUserUseCase } from './RemoveUserUseCase';

let usersRepository: IUsersRepository;
let removeUserUseCase: RemoveUserUseCase;

describe('RemoveUserUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    removeUserUseCase = new RemoveUserUseCase(usersRepository);
  });

  it('should be able to remove a user', async () => {
    const user = await usersRepository.create({
      firstName: 'Testing',
      lastName: 'Test',
      email: 'test@test.com',
      password: await hash('1234567'),
      birthDate: '1990-02-25',
      cpf: '00000000000',
      phone: '00000000000',
      permission: 'ADMIN',
    });

    const response = await removeUserUseCase.execute({ userId: user.id });
    expect(response).toBeUndefined();
  });

  it('should not be able to remove a user if user does not exist', async () => {
    await expect(async () => {
      await removeUserUseCase.execute({
        userId: '18c428dd-8614-482e-bbd7-e1356f743d43',
      });
    }).rejects.toBeInstanceOf(RemoveUserError);
  });
});
