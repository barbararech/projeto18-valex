import { NextFunction, Request, Response } from "express";

export async function authValidationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const companyKey = req.header("x-api-key");

  if (!companyKey) {
    throw { status: 422, message: "Insira corretamente as informações!" };
  }

  res.locals.id = companyKey;
  next();
}
