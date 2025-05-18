import Joi from 'joi';

export const userSchema = Joi.object({
  name: Joi.string().trim().min(2).max(32).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must be at most 32 characters long',
  }),
  email: Joi.string().email().trim().lowercase().max(64).required().messages({
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
  name: Joi.string().trim().min(3).max(20).optional(),
  email: Joi.string().email().trim().lowercase().optional(),
  weight: Joi.number().optional(),
  activityLevel: Joi.number().optional(),
  gender: Joi.string().valid('male', 'female').optional(),
  dailyRequirement: Joi.number().integer().optional(),
});



