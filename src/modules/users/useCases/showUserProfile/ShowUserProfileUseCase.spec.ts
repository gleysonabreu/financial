import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import { hash } from '@shared/services/password';

import { ShowUserProfileError } from './ShowUserProfileError';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let showUserUseCase: ShowUserProfileUseCase;
let usersRepository: IUsersRepository;

describe('ShowUserProfileUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it('should be able to show a user', async () => {
    const user = await usersRepository.create({
      firstName: 'Testing',
      lastName: 'Test',
      email: 'test@test.com',
      birthDate: '1990-02-25',
      cpf: '00000000000',
      phone: '00000000000',
      password: await hash('1234567'),
      permissions: [
        {
          type: 1,
        },
      ],
    });

    const response = await showUserUseCase.execute(user.id);

    expect(response).toBe(user);
  });

  it('should not be able to show a non-existent user', async () => {
    await expect(async () => {
      await showUserUseCase.execute('90bd6741-d80d-4f96-89d3-38d058699063');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
