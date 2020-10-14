import { Response, NextFunction } from 'express';

import { IRequest } from './interfaces';

export const isAuthenticated = (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.isAuthenticated()) {
    return res.status(403).json();
  }

  return next();
};
