import express from 'express';
import {
  getCommentsForPostHandler,
  addCommentToPostHandler,
  deleteCommentHandler,
} from '../controllers/commentController';
import authMiddleware from '../middlewares/postMiddleware';
import { authorizeRoles } from '../middlewares/authorizeRole';

const router = express.Router();

// GET /posts/:postId/comments - Get all comments for a post
router.get('/posts/:postId/comments', getCommentsForPostHandler);

// POST /posts/:postId/comments - Add a comment to a post (reader only)
router.post('/posts/:postId/comments', authMiddleware, authorizeRoles(['reader', 'author', 'admin' ]), addCommentToPostHandler);

// DELETE /comments/:id - Delete a comment by ID (author or admin)
router.delete('/comments/:id', authMiddleware, authorizeRoles(['author', 'admin']), deleteCommentHandler);

export default router;