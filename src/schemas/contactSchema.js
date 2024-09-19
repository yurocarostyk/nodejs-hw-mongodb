import Joi from 'joi';

export const contactSchemaPost = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(3).max(20).required(),
});

export const contactSchemaPatch = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phone: Joi.string().min(3).max(20),
}).or('name', 'email', 'phone'); // Щонайменше одне поле має бути присутнім
