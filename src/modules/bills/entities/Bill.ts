import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('bills')
class Bill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
