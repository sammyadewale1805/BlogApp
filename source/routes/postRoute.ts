// src/routes/posts.ts
import express from 'express';
import {
  getAllPostsHandler,
  getPostByIdHandler,
  createPostHandler,
  updatePostHandler,
  deletePostHandler,
} from '../controllers/postController';
import authMiddleware from '../middlewares/postMiddleware';
import { authorizeRoles } from '../middlewares/authorizeRole';

const router = express.Router();

router.get('/', getAllPostsHandler);
router.get('/:id', getPostByIdHandler);
router.post('/', authMiddleware, authorizeRoles(['author']), createPostHandler);
router.put('/:id', authMiddleware, updatePostHandler);
router.delete('/:id', authMiddleware, deletePostHandler);

export default router;