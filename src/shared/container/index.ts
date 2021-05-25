import { AccountTypesRepository } from '@modules/accountTypes/repositories/AccountTypesRepository';
import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { BillsRepository } from '@modules/bills/repositories/BillsRepository';
import { IBillsRepository } from '@modules/bills/repositories/IBillsRepository';
import { IPermissionsRepository } from '@modules/permissions/repositories/IPermissionsRepository';
import { PermissionsRepository } from '@modules/permissions/repositories/PermissionsRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { UsersRepository } from '@modules/users/repositories/UsersRepository';
import { container } from 'tsyringe';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IPermissionsRepository>(
  'PermissionsRepository',
  PermissionsRepository,
);

container.registerSingleton<IAccountTypesRepository>(
  'AccountTypesRepository',
  AccountTypesRepository,
);

container.registerSingleton<IBillsRepository>(
  'BillsRepository',
  BillsRepository,
);
