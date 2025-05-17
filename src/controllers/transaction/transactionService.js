const { TransactionModel } = require("../../models/transaction");
const {
  getNewDate,
  getMonthlyStatistics,
  getAllTransactionsStatisticsByDate,
} = require("../../helpers/getMonthStatistic");
const { incCategories, expCategories } = require("../../helpers/categories");

const addTransactionExpenseService = async (data, user, owner) => {
  user.balance -= data.amount;
  await user.save();
  const newTransaction = await TransactionModel.create({
    ...data,
    type: "expense",
    owner,
  });
  return {
    status: 201,
    message: {
      newBalance: data.amount,
      transaction: newTransaction,
    },
  };
};

const addTransactionIncomeService = async (data, user, owner) => {
  user.balance += data.amount;
  await user.save();
  const newTransaction = await TransactionModel.create({
    ...data,
    type: "income",
    owner,
  });
  return {
    status: 201,
    message: {
      newBalance: data.amount,
      transaction: newTransaction,
    },
  };
};

const getTransactionIncomeService = async (owner) => {
  const data = await TransactionModel.find({ type: "income", owner }).sort({date: -1});
  const monthStats = getMonthlyStatistics(data);
  return { status: 200, message: { incomes: data, monthStats } };
};

const getTransactionExpenseService = async (owner) => {
  const data = await TransactionModel.find({ type: "expense", owner }).sort({date: -1});
  const monthStats = getMonthlyStatistics(data);
  return { status: 200, message: { expense: data, monthStats } };
};

const getTransactionAllService = async (owner) => {
  const data = await TransactionModel.find({owner}).sort({date: -1}).limit(10);
  const monthStats = getMonthlyStatistics(data);
  return { status: 200, message: { allTransactions: data, monthStats } };
};

const deleteTransactionService = async (_id, owner, user) => {
  const transaction = await TransactionModel.findByIdAndRemove(
    { _id, owner },
    { returnDocument: "before" }
  );
  if (transaction.type === "income") user.balance -= transaction.amount;
  if (transaction.type === "expense") user.balance += transaction.amount;
  await user.save();
  return { status: 200, message: { newBalance: user.balance } };
};

const getTransactionIncomeCategoriesService = async () => {
  const categories = [];
  for (const i of Object.values(incCategories)) {
    categories.push(i);
  }
  return { status: 200, message: categories };
};

const getTransactionExpenseCategoriesService = async () => {
  const categories = [];
  for (const i of Object.values(expCategories)) {
    categories.push(i);
  }
  return { status: 200, message: categories };
};

const getTransactionPeriodDataService = async (date, owner) => {
  const { lowDate, highDate } = getNewDate(date);
  const transaction = await TransactionModel.find({
    date: { $gte: `${lowDate}`, $lte: `${highDate}`, }, owner
  });
  const calculating = getAllTransactionsStatisticsByDate(transaction);
  return { status: 200, message: calculating };
};

module.exports = {
  addTransactionExpenseService,
  addTransactionIncomeService,
  getTransactionIncomeService,
  getTransactionExpenseService,
  getTransactionAllService,
  deleteTransactionService,
  getTransactionIncomeCategoriesService,
  getTransactionExpenseCategoriesService,
  getTransactionPeriodDataService,
};