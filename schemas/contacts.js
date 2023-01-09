const Joi = require("joi");

const addContactsSchema = Joi.object({
  // id: Joi.string().min(3).required().messages({
  //   "any.required": "you should provide id!!",
  // }),
  name: Joi.string().min(3).required().messages({
    "any.required": "you should provide name!!",
  }),
  email: Joi.string().min(3).required().messages({
    "any.required": "you should provide email!!",
  }),
  phone: Joi.number().min(3).required().messages({
    "any.required": "you should provide phone!!",
  }),
});

module.exports = {
  addContactsSchema,
};
