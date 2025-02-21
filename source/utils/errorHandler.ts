import { Response } from 'express';

export const errorHandler = (res: Response, error: any) => {
  console.error(error);
  res.status(500).json({ message: 'Something went wrong.' });
};