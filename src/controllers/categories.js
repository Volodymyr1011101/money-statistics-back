import createHttpError from 'http-errors';

import { getCategoriesByType } from '../services/categories.js';

export const getCategoriesController = async (req, res) => {
  const { type } = req.query;
  const { _id: userId } = req.user;

  if (!['income', 'expense'].includes(type)) {
    throw createHttpError(400, 'Invalid or missing type parameter');
  }

  const data = await getCategoriesByType(type, userId);

  res.json({
    status: 200,
    message: `${type} categories fetched`,
    data,
  });
};
