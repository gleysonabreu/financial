import { AccountTypesRepository } from '@modules/accountTypes/infra/typeorm/repositories/AccountTypesRepository';
import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { BillsRepository } from '@modules/bills/infra/typeorm/repositories/BillsRepository';
import { IBillsRepository } from '@modules/bills/repositories/IBillsRepository';
import { PermissionsRepository } from '@modules/permissions/infra/typeorm/repositories/PermissionsRepository';
import { IPermissionsRepository } from '@modules/permissions/repositories/IPermissionsRepository';
import { UsersRepository } from '@modules/users/infra/typeorm/repositories/UsersRepository';
import { UsersTokensRepository } from '@modules/users/infra/typeorm/repositories/UsersTokensRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/users/repositories/IUsersTokensRepository';
import { container } from 'tsyringe';

import '@shared/container/providers';

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

container.registerSingleton<IUsersTokensRepository>(
  'UsersTokensRepository',
  UsersTokensRepository,
);
