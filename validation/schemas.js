import Joi from 'joi';

export const userSignupSchema = Joi.object({
  username: Joi.string().min(3).max(50).trim().required(),
  password: Joi.string()
    .min(6)
    .pattern(/[!@#$%^&*(),.?":{}|<>]/, 'special character')
    .required(),
});

export const userLoginSchema = Joi.object({
  username: Joi.string().min(3).max(50).trim().required(),
  password: Joi.string().min(6).required(),
});

export const todoCreateSchema = Joi.object({
  text: Joi.string().trim().min(1).max(500).required(),
});

export const todoUpdateSchema = Joi.object({
  text: Joi.string().trim().min(1).max(500),
  completed: Joi.boolean(),
}).or('text', 'completed');

export const idParamSchema = Joi.object({
  id: Joi.string().uuid({ version: 'uuidv4' }),
});