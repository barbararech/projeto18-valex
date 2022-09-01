import { Request, Response } from "express";
import * as cardServices from "../services/cardServices.js";

export async function newCard(req: Request, res: Response) {
  const { type } = req.body;
  const  employeeId = Number(req.params.employeeid);
  const companyKey = res.locals.id;

  await cardServices.newCard(employeeId, type, companyKey);
  return res.sendStatus(201);
}
