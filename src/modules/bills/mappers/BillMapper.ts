import { IBill } from '../DTOS/IBill';

type IResponse = {
  id: string;
  account_type_id: string;
  date: string;
  justification: string;
  value: number;
  account_type: {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
  };
};
class BillMapper {
  static toMany(bills: IBill[]): IResponse[] {
    return bills.map(bill => this.toDTO(bill));
  }

  static toDTO({
    accountTypeId,
    accountType,
    date,
    id,
    justification,
    value,
  }: IBill): IResponse {
    return {
      id,
      justification,
      date,
      value,
      account_type_id: accountTypeId,
      account_type: {
        id: accountType?.id,
        name: accountType?.name,
        created_at: accountType?.createdAt,
        updated_at: accountType?.updatedAt,
      },
    };
  }
}

export { BillMapper };
