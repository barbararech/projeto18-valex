import { Router } from "express";
import { activateCard, newCard } from "../controllers/cardController.js";
import { middleware } from "../middlewares/schemasValidationMiddleware.js";
import * as cardSchemas from "../schemas/cardSchemas.js";
import { authValidationMiddleware } from "../middlewares/authValidationMiddleware.js";

const router = Router();

router.post(
  "/newcard/:employeeid",
  authValidationMiddleware,
  middleware(cardSchemas.addCardSchema),
  newCard
);
router.put(
  "/activatecard/:cardid",
  middleware(cardSchemas.activateCardSchema),
  activateCard
);

export default router;
