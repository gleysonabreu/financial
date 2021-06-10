import { financialEnv } from '@config/financialEnv';
import { CreateAccountTypeController } from '@modules/accountTypes/useCases/createAccountType/CreateAccountTypeController';
import { DeleteAccountTypeController } from '@modules/accountTypes/useCases/deleteAccountType/DeleteAccountTypeController';
import { GetAllAccountTypeController } from '@modules/accountTypes/useCases/getAllAccountType/GetAllAccountTypeController';
import { GetOneAccountTypeController } from '@modules/accountTypes/useCases/getOneAccountType/GetOneAccountTypeController';
import { UpdateAccountTypeController } from '@modules/accountTypes/useCases/updateAccountType/UpdateAccountTypeController';
import { Router } from 'express';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensurePermission } from '../middlewares/ensurePermission';

const accountTypeRouter = Router();
const createAccountTypeController = new CreateAccountTypeController();
const deleteAccountTypeController = new DeleteAccountTypeController();
const updateAccountTypeController = new UpdateAccountTypeController();

const getAllAccountTypeController = new GetAllAccountTypeController();
const getOneAccountTypeController = new GetOneAccountTypeController();

const permissions = [
  ensureAuthenticated,
  ensurePermission([financialEnv.financialAdministrativePermission]),
];

accountTypeRouter.post('/', permissions, createAccountTypeController.execute);
accountTypeRouter.delete(
  '/:id',
  permissions,
  deleteAccountTypeController.execute,
);
accountTypeRouter.put('/:id', permissions, updateAccountTypeController.execute);
accountTypeRouter.get(
  '/',
  [
    ensureAuthenticated,
    ensurePermission([
      financialEnv.financialAdministrativePermission,
      financialEnv.financialManagerPermission,
    ]),
  ],
  getAllAccountTypeController.execute,
);
accountTypeRouter.get('/:id', permissions, getOneAccountTypeController.execute);

export { accountTypeRouter };
