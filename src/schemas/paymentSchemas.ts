import joi from "joi";

export const addPaymentSchema = joi.object({
  cardId: joi.number().required(),
  cardPassword: joi.string().required(),
  amount: joi.number().positive().integer().required(),
});
