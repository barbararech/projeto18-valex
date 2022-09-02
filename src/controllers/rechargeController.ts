import { Request, Response } from "express";
import * as rechargeServices from "../services/rechargeServices.js";

export async function newRecharge(req: Request, res: Response) {
  const { amount } = req.body;
  const cardId = Number(req.params.cardid);
  const companyKey = res.locals.id;

  await rechargeServices.newRecharge(cardId, amount, companyKey);
  return res.sendStatus(201);
}
