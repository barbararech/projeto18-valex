import { Router } from "express";
import { middleware } from "../middlewares/schemasValidationMiddleware.js";
import { newPayment } from "../controllers/paymentController.js";
import { addPaymentSchema } from "../schemas//paymentSchemas.js";

const router = Router();

router.post(
  "/paymentcards/:businessid",
  middleware(addPaymentSchema),
  newPayment
);

export default router;
