import { Request, Response } from 'express';
import { getCommentsForPost, addCommentToPost, deleteComment } from '../services/commentService';
import Post from '../models/postModel';
import Comment from '../models/commentModel';
import { isValidObjectIdString } from '../utils/typeGuards';

// Get all comments for a post
export const getCommentsForPostHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { postId } = req.params;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await getCommentsForPost(postId);
    return res.json(comments);
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : 'Server error' });
  }
};

// Add a comment to a post
export const addCommentToPostHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // Debugging: Log req.user
    console.log('req.user:', req.user);

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Debugging: Log req.user._id
    console.log('req.user._id:', req.user.id);

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Add the comment
    const newComment = await addCommentToPost(postId, content, req.user.id);
    return res.status(201).json(newComment);
  } catch (err) {
    console.error('Error in addCommentToPostHandler:', err);
    return res.status(400).json({ message: err instanceof Error ? err.message : 'Bad request' });
  }
};

// Delete a comment by ID
export const deleteCommentHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the user is the author or an admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this comment' });
    }

    await deleteComment(id);
    return res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : 'Server error' });
  }
};