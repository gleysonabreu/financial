import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryUsersTokensRepository } from '@modules/users/repositories/in-memory/InMemoryUsersTokensRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/users/repositories/IUsersTokensRepository';
import { v4 as uuid } from 'uuid';

import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { hash } from '@shared/services/password';

import { ResetPasswordUserError } from './ResetPasswordUserError';
import { ResetPasswordUserUseCase } from './ResetPasswordUserUseCase';

let resetPasswordUserUseCase: ResetPasswordUserUseCase;
let usersRepository: IUsersRepository;
let dateProvider: DayjsDateProvider;
let usersTokensRepository: IUsersTokensRepository;

describe('ResetPasswordUserUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    dateProvider = new DayjsDateProvider();
    usersTokensRepository = new InMemoryUsersTokensRepository();

    resetPasswordUserUseCase = new ResetPasswordUserUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider,
    );
  });

  it('should be able to reset password', async () => {
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

    const { token } = await usersTokensRepository.create({
      expireDate: dateProvider.addHours(3),
      token: uuid(),
      userId: user.id,
    });

    const userToken = await usersTokensRepository.findUserIdAndToken(
      user.id,
      token,
    );

    const response = await resetPasswordUserUseCase.execute({
      password: '1234567',
      token: userToken.token,
    });
    expect(response).toBeUndefined();
  });

  it('should not be able to reset password if user token does not exist', async () => {
    await expect(async () => {
      await resetPasswordUserUseCase.execute({
        password: '1234567',
        token: '5375f6e0-90ce-43cb-9a5b-b4193d837b5e',
      });
    }).rejects.toBeInstanceOf(ResetPasswordUserError.TokenInvalid);
  });

  it('should not be able to reset password if expire date is expired', async () => {
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

    const userToken = await usersTokensRepository.create({
      expireDate: dateProvider.addHours(-3),
      token: uuid(),
      userId: user.id,
    });

    await expect(async () => {
      await resetPasswordUserUseCase.execute({
        password: '1234567',
        token: userToken.token,
      });
    }).rejects.toBeInstanceOf(ResetPasswordUserError.TokenExpired);
  });
});
