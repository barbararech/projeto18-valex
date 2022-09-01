import { NextFunction, Request, Response } from "express";

interface Error {
  name: string;
  message: string;
  stack?: string;
  status?: number;
  code?: string;
}

export default async function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res
    .status(error.status || 500)
    .send(error.message || "Internal server error");
}
