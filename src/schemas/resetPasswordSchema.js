import Joi from "joi";

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export default resetPasswordSchema;