const express = require("express");
const { 
  addIncomeController, 
  addExpenseController,
  getIncomeController,
  getExpenseController,
  getAllController,
  deleteTransactionController,
  getTransactionIncomeCategoriesController,
  getTransactionExpenseCategoriesController,
  getTransactionPeriodDataController
} = require("../../controllers/transaction/transactionController");
const { ctrlWrapper } = require("../../helpers");
const { validateBody } = require("../../middlewares");
const authenticate = require('../../middlewares/authenticate');
const { JoiTransactionExpense, JoiTransactionIncome } = require("../../models/transaction");
const router = express.Router();

router.use(authenticate)
router.post('/income',[validateBody(JoiTransactionIncome)], ctrlWrapper(addIncomeController))
router.get('/income', ctrlWrapper(getIncomeController))
router.post('/expense',[validateBody(JoiTransactionExpense)], ctrlWrapper(addExpenseController))
router.get('/expense', ctrlWrapper(getExpenseController))
router.get('/all', ctrlWrapper(getAllController))
router.delete('/:id', ctrlWrapper(deleteTransactionController))
router.get('/income-categories', ctrlWrapper(getTransactionIncomeCategoriesController))
router.get('/expense-categories', ctrlWrapper(getTransactionExpenseCategoriesController))
router.get('/period-data', ctrlWrapper(getTransactionPeriodDataController))

module.exports = router