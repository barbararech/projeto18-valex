import { Request, Response } from "express";
import * as cardServices from "../services/cardServices.js";

export async function newCard(req: Request, res: Response) {
  const { type } = req.body;
  const employeeId = Number(req.params.employeeid);
  const companyKey = res.locals.id;

  const cardData = await cardServices.newCard(employeeId, type, companyKey);
  return res.status(201).send(cardData);
}

export async function activateCard(req: Request, res: Response) {
  const { securityCode, password } = req.body;
  const cardId = Number(req.params.cardid);

  await cardServices.activateCard(cardId, securityCode, password);
  return res.status(200).send("Cartão ativado com sucesso!");
}

export async function viewCard(req: Request, res: Response) {
  const { password } = req.body;
  const cardId = Number(req.params.cardid);

  const card = await cardServices.viewCard(cardId, password);
  return res.status(200).send({ card });
}

export async function viewTransactions(req: Request, res: Response) {
  const cardId = Number(req.params.cardid);

  const cardTransactions = await cardServices.viewTransactions(cardId);
  return res.status(200).send(cardTransactions);
}

export async function blockCard(req: Request, res: Response) {
  const { password } = req.body;
  const cardId = Number(req.params.cardid);

  await cardServices.blockCard(cardId, password);
  return res.status(200).send("Cartão bloqueado com sucesso!");
}

export async function unblockCard(req: Request, res: Response) {
  const { password } = req.body;
  const cardId = Number(req.params.cardid);

  await cardServices.unblockCard(cardId, password);
  return res.status(200).send("Cartão desbloqueado com sucesso!");
}
