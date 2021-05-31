import upload from '@config/upload';
import { CreateUserController } from '@modules/users/useCases/createUser/CreateUserController';
import { GetAllUserController } from '@modules/users/useCases/getAllUser/GetAllUserController';
import { RemoveUserController } from '@modules/users/useCases/removeUser/RemoveUserController';
import { GetOneUserController } from '@modules/users/useCases/showUserProfile/GetOneUserController';
import { UpdateUserController } from '@modules/users/useCases/updateUser/UpdateUserController';
import { UpdateUserAvatarController } from '@modules/users/useCases/updateUserAvatar/UpdateUserAvatarController';
import { Router } from 'express';
import multer from 'multer';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensurePermission } from '../middlewares/ensurePermission';
import { multerValidErrors } from '../middlewares/multerValidErrors';

const userRouter = Router();
const uploadAvatar = multer(upload);
const createUserController = new CreateUserController();
const updateUserController = new UpdateUserController();
const getOneUserController = new GetOneUserController();
const getAllUserController = new GetAllUserController();
const removeUserController = new RemoveUserController();
const updateUserAvatarController = new UpdateUserAvatarController();

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

userRouter.patch(
  '/avatar',
  ensureAuthenticated,
  uploadAvatar.single('avatar'),
  updateUserAvatarController.execute,
);

export { userRouter };
