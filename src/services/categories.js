import CategoryModel from '../db/models/categories.js';

const defaultIncomeCategories = ['Incomes'];
const defaultExpenseCategories = [
  'Main expenses',
  'Products',
  'Car',
  'Self care',
  'Child care',
  'Household products',
  'Education',
  'Leisure',
  'Other expenses',
  'Entertainment',
];

export const initializeDefaultCategories = async (userId) => {
  const existing = await CategoryModel.findOne({ userId });
  if (existing) return;

  const income = defaultIncomeCategories.map((name) => ({
    name,
    type: 'income',
    userId,
  }));

  const expenses = defaultExpenseCategories.map((name) => ({
    name,
    type: 'expense',
    userId,
  }));

  await CategoryModel.insertMany([...income, ...expenses]);
};

//  Викликай initializeDefaultCategories(user._id) після реєстрації користувача.

export const getCategoriesByType = async (type, userId) => {
  const categories = await CategoryModel.find({ userId, type });
  return categories;
};
