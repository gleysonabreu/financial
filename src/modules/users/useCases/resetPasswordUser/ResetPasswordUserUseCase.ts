import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/users/repositories/IUsersTokensRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { hash } from '@shared/services/password';

import { ResetPasswordUserError } from './ResetPasswordUserError';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ password, token }: IRequest): Promise<void> {
    const schema = yup.object().shape({
      password: yup.string().min(6).required(),
      token: yup.string().uuid().required(),
    });
    await schema.validate({ password, token }, { abortEarly: false });

    const userToken = await this.usersTokensRepository.findByToken(token);
    if (!userToken) {
      throw new ResetPasswordUserError.TokenInvalid();
    }

    if (
      this.dateProvider.compareIfBefore(
        userToken.expireDate,
        this.dateProvider.dateNow(),
      )
    ) {
      throw new ResetPasswordUserError.TokenExpired();
    }

    const user = await this.usersRepository.findById(userToken.userId);
    user.password = await hash(password);

    await this.usersRepository.update(user);
    await this.usersTokensRepository.deleteById(userToken.id);
  }
}

export { ResetPasswordUserUseCase };
