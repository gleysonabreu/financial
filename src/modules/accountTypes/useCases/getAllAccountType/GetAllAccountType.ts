import { IAccountType } from '@modules/accountTypes/DTOS/IAccountType';
import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { IGetAllAccountTypeDTO } from './IGetAllAccountTypeDTO';

type IResponse = {
  accountTypes: IAccountType[];
  totalAccountTypes: number;
};
@injectable()
class GetAllAccountType {
  constructor(
    @inject('AccountTypesRepository')
    private accountTypesRepository: IAccountTypesRepository,
  ) {}

  async execute({
    name,
    page,
    per_page: perPage,
  }: IGetAllAccountTypeDTO): Promise<IResponse> {
    const schema = yup.object().shape({
      name: yup.string(),
      page: yup.number(),
      per_page: yup.number(),
    });

    const take = perPage || 0;
    const skip = page ? (page - 1) * take : 0;

    await schema.validate(
      { page: skip, name, per_page: take },
      { abortEarly: false },
    );

    const accountTypes = await this.accountTypesRepository.findAll({
      name,
      page: skip,
      per_page: take,
    });

    const totalAccountTypes = (
      await this.accountTypesRepository.findAll({
        name,
      })
    ).length;

    return { accountTypes, totalAccountTypes };
  }
}

export { GetAllAccountType };
