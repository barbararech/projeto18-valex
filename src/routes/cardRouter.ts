import { Router } from "express";
import { newCard } from "../controllers/cardController.js";
import { middleware } from "../middlewares/schemasValidationMiddleware.js";
import { addCardSchema } from "../schemas/cardSchemas.js";
import { authValidationMiddleware } from "../middlewares/authValidationMiddleware.js";

const router = Router();

router.post(
  "/newcard/:employeeid",
  authValidationMiddleware,
  middleware(addCardSchema),
  newCard
);
// router.get("/urls/:id", getURL);
// router.get("/urls/open/:shortUrl", openURL);
// router.delete("/urls/:id", tokenValidationMiddleware, deleteURL);

export default router;
