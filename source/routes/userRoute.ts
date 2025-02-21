import express from 'express';
import { authenticate} from '../middlewares/authMiddleware';
import { getAllUsers, deleteUser, promoteUser } from '../controllers/userController';
import {authorizeRoles} from '../middlewares/authorizeRole';

const router = express.Router();

// Protect routes with authenticate and authorize middleware
router.get('/', authenticate, authorizeRoles(['admin']), getAllUsers);
router.delete('/:id', authenticate, authorizeRoles(['admin']), deleteUser);
router.put('/promote', authenticate, authorizeRoles(['admin']), promoteUser);

export default router;