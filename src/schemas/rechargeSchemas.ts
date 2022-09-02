import joi from "joi";

export const addRechargeSchema = joi.object({
  amount: joi.number().min(0).required(),
});
