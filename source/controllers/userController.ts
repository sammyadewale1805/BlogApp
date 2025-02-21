import { Request, Response } from 'express';
import User from '../models/userModel';
import { errorHandler } from '../utils/errorHandler';
import { Types } from 'mongoose';


export const getAllUsers = async (req: Request, res: Response) => {
    try {
      const { page = '1', limit = '10', role } = req.query;
  
      // Convert page and limit to numbers
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);
  
      // Validate page and limit
      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
        return res.status(400).json({ message: 'Invalid page or limit value.' });
      }
  
      const query: any = {};
      if (role) query.role = role;
  
      const users = await User.find(query)
        .select('-password')
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
  
      res.status(200).json(users);
    } catch (error) {
      errorHandler(res, error);
    }
  };

  export const deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      // Check if the ID is a valid ObjectId
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID.' });
      }
  
      // Use type assertion to tell TypeScript that req.user._id is a string
      if ((req.user?._id as string) === id) {
        return res.status(400).json({ message: 'You cannot delete yourself.' });
      }
  
      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).json({ message: 'User not found.' });
  
      res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
      errorHandler(res, error);
    }
  };

  export const promoteUser = async (req: Request, res: Response) => {
    try {
      const { userId, role } = req.body;
  
      // Validate the role
      const validRoles = ['admin', 'author'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role.' });
      }
  
      // Find the user and update their role
      const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.status(200).json({ message: 'User role updated successfully.', user });
    } catch (error) {
      errorHandler(res, error);
    }
  };