import { CreateUserController } from '@modules/users/useCases/createUser/CreateUserController';
import { GetOneUserController } from '@modules/users/useCases/showUserProfile/GetOneUserController';
import { UpdateUserController } from '@modules/users/useCases/updateUser/UpdateUserController';
import { Router } from 'express';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensurePermission } from '../middlewares/ensurePermission';

const userRouter = Router();
const createUserController = new CreateUserController();
const updateUserController = new UpdateUserController();
const getOneUserController = new GetOneUserController();

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

export { userRouter };
