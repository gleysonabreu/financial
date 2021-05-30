import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/users/repositories/IUsersTokensRepository';
import path from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuid } from 'uuid';
import * as yup from 'yup';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/IMailProvider';

import { SendForgotPasswordError } from './SendForgotPasswordError';

@injectable()
class SendForgotPasswordMailUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DayjsDateProvider')
    private dayjsDateProvider: IDateProvider,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  async execute(email: string): Promise<void> {
    const schema = yup.object().shape({
      email: yup.string().email().min(1).required(),
    });
    await schema.validate({ email }, { abortEarly: false });

    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new SendForgotPasswordError();
    }

    const pathTemplate = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'emails',
      'forgotPassword.hbs',
    );

    const token = uuid();
    const expireDate = this.dayjsDateProvider.addHours(3);
    const variables = {
      name: `${user.firstName} ${user.lastName}`,
      url: `${process.env.FORGOT_PASSWORD_MAIL_URL}${token}`,
    };

    await this.usersTokensRepository.create({
      expireDate,
      token,
      userId: user.id,
    });

    await this.mailProvider.sendMail(
      email,
      process.env.FORGOT_PASSWORD_TEXT_MAIL,
      variables,
      pathTemplate,
    );
  }
}

export { SendForgotPasswordMailUseCase };
