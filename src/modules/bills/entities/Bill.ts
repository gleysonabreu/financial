import { AccountType } from '@modules/accountTypes/entities/AccountType';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('bills')
class Bill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AccountType, accountT => accountT.bills, { eager: true })
  @JoinColumn({ name: 'account_type_id' })
  accountType: AccountType;

  @Column({ name: 'account_type_id' })
  accountTypeId: string;

  @Column()
  value: number;

  @Column()
  justification: string;

  @Column({ type: 'date' })
  date: string;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Bill };
