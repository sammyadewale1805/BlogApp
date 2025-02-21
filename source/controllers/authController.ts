import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { errorHandler } from '../utils/errorHandler';

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Create a new user with the default role of 'reader'
    const user = new User({ username, email, password, role: 'reader' });
    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    // Include the user's role in the token payload
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    errorHandler(res, error);
  }
};