import { CreateUserController } from '@modules/users/useCases/createUser/CreateUserController';
import { UpdateUserController } from '@modules/users/useCases/updateUser/UpdateUserController';
import { Router } from 'express';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensurePermission } from '../middlewares/ensurePermission';

const userRouter = Router();
const createUserController = new CreateUserController();
const updateUserController = new UpdateUserController();

userRouter.post(
  '/',
  [ensureAuthenticated, ensurePermission()],
  createUserController.execute,
);
userRouter.put('/', [ensureAuthenticated], updateUserController.execute);

export { userRouter };
