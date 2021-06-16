import { permissions } from '@config/permissions';
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

const permissionsRoutes = [
  ensureAuthenticated,
  ensurePermission([permissions.FINANCIAL]),
];

accountTypeRouter.post(
  '/',
  permissionsRoutes,
  createAccountTypeController.execute,
);
accountTypeRouter.delete(
  '/:id',
  permissionsRoutes,
  deleteAccountTypeController.execute,
);
accountTypeRouter.put(
  '/:id',
  permissionsRoutes,
  updateAccountTypeController.execute,
);
accountTypeRouter.get(
  '/',
  ensureAuthenticated,
  ensurePermission([permissions.FINANCIAL, permissions.MANAGER]),
  getAllAccountTypeController.execute,
);
accountTypeRouter.get(
  '/:id',
  permissionsRoutes,
  getOneAccountTypeController.execute,
);

export { accountTypeRouter };
