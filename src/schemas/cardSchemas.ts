import joi from "joi";

export const addCardSchema = joi.object({
  type: joi
    .string()
    .valid("groceries", "restaurant", "transport", "education", "health")
    .required(),
});

export const activateCardSchema = joi.object({
  password: joi.string().length(4).required(),
  securityCode: joi.string().length(3).required(),
});

export const viewCardSchema = joi.object({
  password: joi.string().length(4).required(),
});
