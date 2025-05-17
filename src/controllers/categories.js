import createHttpError from 'http-errors';

import { getCategoriesByType } from '../services/categories.js';

export const getCategories = async (req, res) => {
  const { type } = req.query;

  if (!['income', 'expense'].includes(type)) {
    throw createHttpError(400, 'Invalid or missing type parameter');
  }

  const { _id: userId } = req.user;
  const data = await getCategoriesByType(type, userId);

  res.json({
    status: 200,
    message: `${type} categories fetched`,
    data,
  });
};
