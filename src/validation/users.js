import Joi from 'joi';

import { emailRegex } from '../constants/index.js';

export const userSchema = Joi.object({
  name: Joi.string().trim().min(2).max(32).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must be at most 32 characters long',
  }),
  email: Joi.string().max(64).regex(emailRegex).required().messages({
    'string.email': 'Invalid email format',
    'string.max': 'Email must be at most 64 characters long',
    'string.empty': 'Email is required',
  }),
  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, and one digit.',
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must be at most 64 characters long',
      'string.empty': 'Password is required',
    }),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(32),
  email: Joi.string().max(64).regex(emailRegex),
});
