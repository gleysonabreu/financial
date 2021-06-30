import { IAccountType } from '@modules/accountTypes/DTOS/IAccountType';

interface IBill {
  id: string;
  accountType: IAccountType;
  accountTypeId: string;
  value: number;
  justification: string;
  date: string;
}

export { IBill };
