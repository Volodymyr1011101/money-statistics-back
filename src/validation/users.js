import Joi from "joi";

export const userSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one digit.",
    }),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(3).max(20).optional(),
  email: Joi.string().email().trim().lowercase().optional(),
  weight: Joi.number().optional(),
  activityLevel: Joi.number().optional(),
  gender: Joi.string().valid("male", "female").optional(),
  dailyRequirement: Joi.number().integer().optional(),
});

export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one digit.",
    }),
  token: Joi.string()
    .pattern(/^[\w-]+\.[\w-]+\.[\w-]+$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid token format.",
    }),
});

export const loginWithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required(),
});
