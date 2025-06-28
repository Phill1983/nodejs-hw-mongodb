import Joi from "joi";

export const addContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  contactType: Joi.string().valid("family", "friend", "work").optional(),
  isFavourite: Joi.boolean().optional(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().min(3).max(20).optional(),
  contactType: Joi.string().valid("family", "friend", "work").optional(),
  isFavourite: Joi.boolean().optional(),
}).min(1);

