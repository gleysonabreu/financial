import { Permission } from '@modules/permissions/infra/typeorm/entities/Permission';
import { IUser } from '@modules/users/DTO/IUser';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('users')
class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'char' })
  cpf: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: string;

  @Column()
  avatar: string;

  @Column()
  phone: string;

  @OneToMany(() => Permission, permission => permission.user, {
    eager: true,
    cascade: ['insert', 'update', 'remove'],
  })
  permissions: Permission[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { User };
