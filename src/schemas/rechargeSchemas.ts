import joi from "joi";

export const addRechargeSchema = joi.object({
  amount: joi.number().positive().integer().required(),
});
