import { User } from '@modules/users/entities/User';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import moment from 'moment';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { hash } from '@shared/services/password';

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
    permissions,
    birthDate,
    cpf,
    phone,
  }: ICreateUserDTO): Promise<User> {
    const schema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required(),
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      permissions: yup
        .array()
        .of(
          yup.object().shape({
            type: yup.number().required(),
          }),
        )
        .required(),
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
        permissions,
        birthDate,
        cpf,
        phone,
      },
      { abortEarly: false },
    );

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
      permissions,
    });

    return user;
  }
}

export { CreateUserUseCase };
