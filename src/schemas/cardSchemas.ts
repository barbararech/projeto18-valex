import joi from "joi";

export const addCardSchema = joi.object({
  type: joi
    .string()
    .valid("groceries", "restaurant", "transport", "education", "health")
    .required(),
});

