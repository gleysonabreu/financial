import { AuthenticateUserController } from '@modules/users/useCases/authenticateUser/AuthenticateUserController';
import { Router } from 'express';

const authenticationRouter = Router();
const authenticateUserController = new AuthenticateUserController();

authenticationRouter.post('/auth', authenticateUserController.execute);

export { authenticationRouter };
