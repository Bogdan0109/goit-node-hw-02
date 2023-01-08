const Joi = require("joi");

const addContactsSchema = Joi.object({
  id: Joi.string().min(3).required().messages({
    "any.required": "you should provide title!!",
  }),
  name: Joi.string().min(3).required().messages({
    "any.required": "you should provide title!!",
  }),
  email: Joi.string().min(3).required().messages({
    "any.required": "you should provide title!!",
  }),
  phone: Joi.number().min(3).required().messages({
    "any.required": "you should provide title!!",
  }),
});

module.exports = {
  addContactsSchema,
};
