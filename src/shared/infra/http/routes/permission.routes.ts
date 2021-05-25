import { CreatePermissionController } from '@modules/permissions/useCases/createPermission/CreatePermissionController';
import { DeletePermissionController } from '@modules/permissions/useCases/deletePermission/DeletePermissionController';
import { Router } from 'express';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensurePermission } from '../middlewares/ensurePermission';

const permissionRouter = Router();
const createPermissionController = new CreatePermissionController();
const deletePermissionController = new DeletePermissionController();

permissionRouter.post(
  '/',
  [ensureAuthenticated, ensurePermission()],
  createPermissionController.execute,
);
permissionRouter.delete(
  '/:id',
  [ensureAuthenticated, ensurePermission()],
  deletePermissionController.execute,
);

export { permissionRouter };
