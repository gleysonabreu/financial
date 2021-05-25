import { financialEnv } from '@config/financialEnv';
import { CreateBillController } from '@modules/bills/useCases/createBill/CreateBillController';
import { DeleteBillController } from '@modules/bills/useCases/deleteBill/DeleteBillController';
import { GetAllBillController } from '@modules/bills/useCases/getAllBill/GetAllBillController';
import { GetOneBillController } from '@modules/bills/useCases/getOneBill/GetOneBillController';
import { UpdateBillController } from '@modules/bills/useCases/updateBill/UpdateBillController';
import { Router } from 'express';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensurePermission } from '../middlewares/ensurePermission';

const billRouter = Router();
const createBillController = new CreateBillController();
const updateBillController = new UpdateBillController();
const getOneBillController = new GetOneBillController();
const deleteBillController = new DeleteBillController();
const getAllBillController = new GetAllBillController();

const permissions = [
  ensureAuthenticated,
  ensurePermission([financialEnv.financialAdministrativePermission]),
];
billRouter.post('/', permissions, createBillController.execute);
billRouter.get('/', ensureAuthenticated, getAllBillController.execute);
billRouter.put('/:id', permissions, updateBillController.execute);
billRouter.get('/:id', ensureAuthenticated, getOneBillController.execute);
billRouter.delete('/:id', permissions, deleteBillController.execute);

export { billRouter };
