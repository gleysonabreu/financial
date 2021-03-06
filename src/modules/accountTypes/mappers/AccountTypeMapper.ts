import { IAccountType } from '../DTOS/IAccountType';

type IResponse = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
};
class AccountTypeMapper {
  static toMany(accountTypes: IAccountType[]): IResponse[] {
    return accountTypes.map(accountType => this.toDTO(accountType));
  }

  static toDTO({ id, createdAt, name, updatedAt }: IAccountType): IResponse {
    return {
      id,
      name,
      created_at: createdAt,
      updated_at: updatedAt,
    };
  }
}

export { AccountTypeMapper };
