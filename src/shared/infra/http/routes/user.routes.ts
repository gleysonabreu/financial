import { CreateUserController } from '@modules/users/useCases/createUser/CreateUserController';
import { GetAllUserController } from '@modules/users/useCases/getAllUser/GetAllUserController';
import { RemoveUserController } from '@modules/users/useCases/removeUser/RemoveUserController';
import { GetOneUserController } from '@modules/users/useCases/showUserProfile/GetOneUserController';
import { UpdateUserController } from '@modules/users/useCases/updateUser/UpdateUserController';
import { Router } from 'express';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensurePermission } from '../middlewares/ensurePermission';

const userRouter = Router();
const createUserController = new CreateUserController();
const updateUserController = new UpdateUserController();
const getOneUserController = new GetOneUserController();
const getAllUserController = new GetAllUserController();
const removeUserController = new RemoveUserController();

userRouter.post(
  '/',
  [ensureAuthenticated, ensurePermission()],
  createUserController.execute,
);
userRouter.put('/', [ensureAuthenticated], updateUserController.execute);
userRouter.get(
  '/:id',
  [ensureAuthenticated, ensurePermission()],
  getOneUserController.execute,
);
userRouter.get(
  '/',
  [ensureAuthenticated, ensurePermission()],
  getAllUserController.execute,
);
userRouter.delete(
  '/:id',
  [ensureAuthenticated, ensurePermission()],
  removeUserController.execute,
);

export { userRouter };
