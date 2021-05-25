import { Router } from 'express';

import { accountTypeRouter } from './accountType.routes';
import { authenticationRouter } from './authentication.routes';
import { billRouter } from './bill.routes';
import { permissionRouter } from './permission.routes';
import { userRouter } from './user.routes';
import { userProfileRouter } from './userProfile.routes';

const router = Router();

router.use('/', authenticationRouter);
router.use('/users', userRouter);
router.use('/profile', userProfileRouter);
router.use('/permissions', permissionRouter);
router.use('/account-types', accountTypeRouter);
router.use('/bills', billRouter);

export { router };
