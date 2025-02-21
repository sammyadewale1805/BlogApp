// src/utils/typeGuards.ts
import { Types } from 'mongoose';

export const isValidObjectIdString = (value: unknown): value is string => {
  
  return typeof value === 'string' && Types.ObjectId.isValid(value);
};