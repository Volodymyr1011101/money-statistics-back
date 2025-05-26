import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middleware/authenticate.js';
import {
    getTransactionsController,
    createTransactionController,
    updateTransactionController,
    deleteTransactionController, getAllTransactionsController,
} from '../controllers/transactions.js';
import { validateBody } from '../utils/validateBody.js';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '../validation/transactions.js';

const transactionRouter = Router();

transactionRouter.use(ctrlWrapper(authenticate));

transactionRouter.get('/', ctrlWrapper(getAllTransactionsController));

transactionRouter.get(
  '/summary',
  validateBody(updateTransactionSchema),
  ctrlWrapper(getTransactionsController),
);

transactionRouter.post(
  '/create',
  validateBody(createTransactionSchema),
  ctrlWrapper(createTransactionController),
);

transactionRouter.put(
  '/:id',
  validateBody(updateTransactionSchema),
  ctrlWrapper(updateTransactionController),
);

transactionRouter.delete(
  '/:id',
  ctrlWrapper(deleteTransactionController),
);

export default transactionRouter;
