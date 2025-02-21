import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import User, { IUser } from '../models/userModel'; // Import IUser

// Inline type declaration for extending the Request object
declare module 'express' {
  interface Request {
    user?: any; // Use the IUser interface
  }
}

// src/middlewares/authMiddleware.ts
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Attach the user's ID and role to the request object
      req.user = { _id: user._id, role: decoded.role };
      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return res.status(401).json({ message: 'Token expired.' });
      }
      if (error instanceof JsonWebTokenError) {
        return res.status(400).json({ message: 'Invalid token.' });
      }
      res.status(500).json({ message: 'Something went wrong.' });
    }
  };