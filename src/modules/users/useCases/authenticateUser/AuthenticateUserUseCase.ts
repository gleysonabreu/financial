import { ProfileData } from '@modules/users/mappers/ProfileData';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { compare } from '@shared/services/password';
import { sign } from '@shared/services/token';

import { IAuthenticateUserResponseDTO } from './IAuthenticateUserResponseDTO';
import { IncorrectEmailOrPassword } from './IncorrectEmailOrPassword';

interface IRequest {
  email: string;
  password: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    email,
    password,
  }: IRequest): Promise<IAuthenticateUserResponseDTO> {
    const schema = yup.object().shape({
      email: yup.string().min(10).email().required(),
      password: yup.string().min(6).required(),
    });
    await schema.validate({ email, password }, { abortEarly: false });

    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new IncorrectEmailOrPassword();
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new IncorrectEmailOrPassword();
    }

    const permissions = user.permissions.map(permission => permission.type);
    const token = await sign({
      payload: {
        user: {
          id: user.id,
          roles: permissions,
        },
      },
      sub: user.id,
    });

    return {
      token,
      permissions,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        avatar: user.avatar,
        avatar_url: ProfileData.convertToUrl(user.avatar),
      },
    };
  }
}

export { AuthenticateUserUseCase };
