import Joi from 'joi';

import { contactTypeList, phoneNumberPattern } from '../constants/contacts.js';

export const addContactValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'name should have at most {$limit} characters',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().pattern(phoneNumberPattern).required().messages({
    'any.required': 'Phone number is required',
    'string.pattern.base': 'Please double-check the phone number',
  }),
  email: Joi.string().email().messages({
    'string,email': 'Please make sure that email is correct.',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...contactTypeList),
});

export const patchContactValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'name should have at most {$limit} characters',
  }),
  phoneNumber: Joi.string().pattern(phoneNumberPattern).messages({
    'string.pattern.base': 'Please double-check the phone number',
  }),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...contactTypeList),
});