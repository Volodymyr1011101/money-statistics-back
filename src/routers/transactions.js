import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getTransactionsController } from '../controllers/transactions.js';
import { validateBody } from '../utils/validateBody.js';
import { updateTransactionSchema } from '../validation/transactions.js';

const router = Router();

router.get(
  '/summary',
  validateBody(updateTransactionSchema),
  ctrlWrapper(getTransactionsController)
);

export default router;
