import { NextFunction, Request, Response } from 'express';

export const LoggerGlobal = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const fechaActual = new Date();
  const fechaEjecucion = fechaActual.toLocaleDateString();
  const horaActual = fechaActual.toLocaleTimeString();

  console.log(
    `Request: ${req.method}, Url: ${req.url}, Date: ${fechaEjecucion}, Time: ${horaActual}`,
  );
  next();
};
