import Joi from 'joi';

export const createTransactionSchema = Joi.object({
  sum: Joi.number().min(0).max(1000000).required(),
  category: Joi.string()
    .min(3)
    .max(30)
    .valid(
      'Main expenses',
      'Products',
      'Car',
      'Self care',
      'Child care',
      'Household products',
      'Education',
      'Leisure',
      'Other expenses',
      'Entertainment'
    )
    .required(),
  type: Joi.string().valid('income', 'expense').required(),
  date: Joi.date().iso().required(),
    comment: Joi.string().allow('').required(),
    userId: Joi.string().required(),
});

export const updateTransactionSchema = Joi.object({
  sum: Joi.number().min(0).max(1000000),
  category: Joi.string()
    .min(3)
    .max(30)
    .valid(
      'Main expenses',
      'Products',
      'Car',
      'Self care',
      'Child care',
      'Household products',
      'Education',
      'Leisure',
      'Other expenses',
      'Entertainment'
    ),
  transactionType: Joi.string().valid('income', 'expense'),
  date: Joi.date(),
});
