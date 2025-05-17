import express from 'express';

import {
  getIncomeCategories,
  getExpenseCategories,
} from '../controllers/categories.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.get('/expenses', authenticate, getIncomeCategories);
router.get('/incomes', authenticate, getExpenseCategories);

export default router;
