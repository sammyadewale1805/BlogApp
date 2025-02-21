// src/middlewares/authorizeRoles.ts
import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user!.role)
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You are not authorized to perform this action.' });
    }
    next();
  };
};