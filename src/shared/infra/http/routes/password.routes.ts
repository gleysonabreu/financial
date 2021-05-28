import { SendForgotPasswordController } from '@modules/users/useCases/sendForgotPasswordMail/SendForgotPasswordController';
import { Router } from 'express';

const passwordRouter = Router();
const sendForgotPasswordMail = new SendForgotPasswordController();

passwordRouter.post('/forgot', sendForgotPasswordMail.execute);

export { passwordRouter };
