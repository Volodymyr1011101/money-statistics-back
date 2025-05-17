import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getTransactionsController,
  createTransactionController,
  updateTransactionController,
  deleteTransactionController
} from '../controllers/transactions.js';
import { validateBody } from '../utils/validateBody.js';
import { transactionSchema, updateTransactionSchema } from '../validation/transactions.js';

const router = Router();

router.get('/summary', validateBody(updateTransactionSchema), ctrlWrapper(getTransactionsController));

router.post('/create', validateBody(transactionSchema), ctrlWrapper(createTransactionController));

router.put('/update/:id', validateBody(updateTransactionSchema), ctrlWrapper(updateTransactionController));

router.delete('/delete/:id', ctrlWrapper(deleteTransactionController));

export default router;
