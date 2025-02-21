import { Request, Response, NextFunction } from 'express';
import Comment from '../models/commentModel';

// Middleware to validate commentId and check if the comment exists
export const commentMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Attach the comment to the request object for use in the controller
    req.comment = comment;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};