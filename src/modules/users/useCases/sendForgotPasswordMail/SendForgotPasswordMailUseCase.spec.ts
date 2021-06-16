import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryUsersTokensRepository } from '@modules/users/repositories/in-memory/InMemoryUsersTokensRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/users/repositories/IUsersTokensRepository';

import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/IMailProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { hash } from '@shared/services/password';

import { SendForgotPasswordError } from './SendForgotPasswordError';
import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepository: IUsersRepository;
let dateProvider: DayjsDateProvider;
let usersTokensRepository: IUsersTokensRepository;
let mailProvider: IMailProvider;

describe('SendForgotPasswordMailUseCase', () => {
  beforeEach(() => {
    mailProvider = new MailProviderInMemory();
    usersRepository = new InMemoryUsersRepository();
    dateProvider = new DayjsDateProvider();
    usersTokensRepository = new InMemoryUsersTokensRepository();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider,
      mailProvider,
    );
  });

  it('should be able to send a forgot password', async () => {
    const sendMail = spyOn(mailProvider, 'sendMail');

    await usersRepository.create({
      birthDate: '2020-02-15',
      cpf: '00000000000',
      email: 'test@test.com',
      firstName: 'Testing',
      lastName: 'Test',
      password: await hash('1234567'),
      permission: 'ADMIN',
      phone: '00000000000',
    });

    await sendForgotPasswordMailUseCase.execute('test@test.com');

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send an email if user does not exists', async () => {
    await expect(async () => {
      await sendForgotPasswordMailUseCase.execute('test@test.com');
    }).rejects.toBeInstanceOf(SendForgotPasswordError);
  });

  it('should be able to create an users token', async () => {
    const generateToken = spyOn(usersTokensRepository, 'create');

    await usersRepository.create({
      birthDate: '2020-02-15',
      cpf: '00000000000',
      email: 'test@test.com',
      firstName: 'Testing',
      lastName: 'Test',
      password: await hash('1234567'),
      permission: 'ADMIN',
      phone: '00000000000',
    });

    await sendForgotPasswordMailUseCase.execute('test@test.com');
    expect(generateToken).toBeCalled();
  });
});
