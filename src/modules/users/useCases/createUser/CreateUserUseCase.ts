import { User } from '@modules/users/entities/User';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import moment from 'moment';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { hash } from '@shared/services/password';
import { validPermissions } from '@shared/utils/validPermissions';

import { CreateUserError } from './CreateUserError';
import { ICreateUserDTO } from './ICreateUserDTO';

@injectable()
class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    email,
    password,
    firstName,
    lastName,
    permission,
    birthDate,
    cpf,
    phone,
  }: ICreateUserDTO): Promise<User> {
    const schema = yup.object().shape({
      email: yup.string().min(10).email().required(),
      password: yup.string().min(6).required(),
      firstName: yup.string().min(5).required(),
      lastName: yup.string().min(5).required(),
      permission: yup.string().required(),
      birthDate: yup
        .string()
        .test(
          'Date of Birth',
          'Date in invalid format, put in the following format (YYYY-MM-DD)',
          value => {
            return moment(value, 'YYYY-MM-DD', true).isValid();
          },
        ),
      cpf: yup.string().min(11).max(11).required(),
      phone: yup.string().min(11).max(11).required(),
    });
    await schema.validate(
      {
        email,
        password,
        firstName,
        lastName,
        permission,
        birthDate,
        cpf,
        phone,
      },
      { abortEarly: false },
    );

    if (!validPermissions(permission)) {
      throw new CreateUserError.PermissionNotExist();
    }

    const emailAlreadyExists = await this.usersRepository.findByEmail(email);
    if (emailAlreadyExists) {
      throw new CreateUserError.EmailAlreadyExists();
    }

    const phoneAlreadyExists = await this.usersRepository.findByPhone(phone);
    if (phoneAlreadyExists) {
      throw new CreateUserError.PhoneAlreadyExists();
    }

    const cpfAlreadyExists = await this.usersRepository.findByCpf(cpf);
    if (cpfAlreadyExists) {
      throw new CreateUserError.CpfAlreadyExists();
    }

    const passwordHash = await hash(password);
    const user = await this.usersRepository.create({
      email,
      password: passwordHash,
      firstName,
      lastName,
      birthDate,
      cpf,
      phone,
      permission,
    });

    return user;
  }
}

export { CreateUserUseCase };
