import Joi from 'joi';

import { emailRegExp } from '../constants/auth.js';

export const registerUserValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().min(4).required(),
});

export const loginUserValidationSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().min(4).required(),
});