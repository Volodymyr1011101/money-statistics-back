import CategoryModel from '../db/models/categories.js';

export const getIncomeCategories = async (req, res) => {
  const categories = await CategoryModel.find({
    userId: req.user._id,
    type: 'income',
  });

  res.json({
    status: 200,
    message: 'Income categories fetched',
    data: categories,
  });
};

export const getExpenseCategories = async (req, res) => {
  const categories = await CategoryModel.find({
    userId: req.user._id,
    type: 'expense',
  });

  res.json({
    status: 200,
    message: 'Expense categories fetched',
    data: categories,
  });
};
