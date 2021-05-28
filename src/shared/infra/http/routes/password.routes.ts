import { ResetPasswordUserController } from '@modules/users/useCases/resetPasswordUser/ResetPasswordUserController';
import { SendForgotPasswordController } from '@modules/users/useCases/sendForgotPasswordMail/SendForgotPasswordController';
import { Router } from 'express';

const passwordRouter = Router();
const sendForgotPasswordMail = new SendForgotPasswordController();
const resetPasswordUserController = new ResetPasswordUserController();

passwordRouter.post('/forgot', sendForgotPasswordMail.execute);
passwordRouter.post('/reset', resetPasswordUserController.execute);

export { passwordRouter };
