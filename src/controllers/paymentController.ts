import { Request, Response } from "express";
import * as paymentServices from "../services/paymentServices.js";

export async function newPayment(req: Request, res: Response) {
  const { cardId, cardPassword, amount } = req.body;
  const businessId = Number(req.params.businessid);

  await paymentServices.newPayment(cardId, cardPassword, businessId, amount);
  return res.sendStatus(201);
}
