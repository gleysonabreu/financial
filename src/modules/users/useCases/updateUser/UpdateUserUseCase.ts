import { User } from '@modules/users/entities/User';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import moment from 'moment';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { IUpdateUserDTO } from './IUpdateUserDTO';
import { UpdateUserUseCaseError } from './UpdateUserUseCaseError';

@injectable()
class UpdateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    email,
    firstName,
    id,
    lastName,
    cpf,
    phone,
    birthDate,
  }: IUpdateUserDTO): Promise<User> {
    const schema = yup.object().shape({
      email: yup.string().email().required(),
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      id: yup.string().uuid().required(),
      cpf: yup.string().min(11).max(11).required(),
      phone: yup.string().min(11).max(11).required(),
      birthDate: yup
        .string()
        .test(
          'Date of Birth',
          'Date in invalid format, put in the following format (YYYY-MM-DD)',
          value => {
            return moment(value, 'YYYY-MM-DD', true).isValid();
          },
        ),
    });
    await schema.validate(
      {
        email,
        firstName,
        lastName,
        id,
        cpf,
        phone,
        birthDate,
      },
      { abortEarly: false },
    );

    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new UpdateUserUseCaseError.UpdateUserNotFound();
    }

    const emailAlreadyExists = await this.usersRepository.findByEmail(email);
    if (emailAlreadyExists && emailAlreadyExists.id !== id) {
      throw new UpdateUserUseCaseError.EmailAlreadyExistsError();
    }

    const phoneAlreadyExists = await this.usersRepository.findByPhone(phone);
    if (phoneAlreadyExists && phoneAlreadyExists.id !== id) {
      throw new UpdateUserUseCaseError.PhoneAlreadyExists();
    }

    const cpfAlreadyExists = await this.usersRepository.findByCpf(cpf);
    if (cpfAlreadyExists && cpfAlreadyExists.id !== id) {
      throw new UpdateUserUseCaseError.CpfAlreadyExists();
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.birthDate = birthDate;
    user.email = email;
    user.cpf = cpf;
    user.phone = phone;

    const userUpdate = await this.usersRepository.update(user);
    return userUpdate;
  }
}

export { UpdateUserUseCase };
