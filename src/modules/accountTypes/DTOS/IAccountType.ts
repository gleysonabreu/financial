import { IBill } from '@modules/bills/DTOS/IBill';

interface IAccountType {
  id: string;
  name: string;
  bills: IBill[];
  createdAt: Date;
  updatedAt: Date;
}

export { IAccountType };
