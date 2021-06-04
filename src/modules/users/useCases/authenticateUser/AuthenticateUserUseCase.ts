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
      email: yup.string().email().required(),
      password: yup.string().required(),
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
    const token = await sign(
      {
        user: {
          id: user.id,
          roles: permissions,
        },
      },
      user.id,
    );

    return {
      token,
      permissions,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        avatarUrl: ProfileData.convertToUrl(user.avatar),
      },
    };
  }
}

export { AuthenticateUserUseCase };
