"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const postMiddleware_1 = __importDefault(require("../middlewares/postMiddleware"));
const authorizeRole_1 = require("../middlewares/authorizeRole");
const router = express_1.default.Router();
// GET /posts/:postId/comments - Get all comments for a post
router.get('/posts/:postId/comments', commentController_1.getCommentsForPostHandler);
// POST /posts/:postId/comments - Add a comment to a post (reader only)
router.post('/posts/:postId/comments', postMiddleware_1.default, (0, authorizeRole_1.authorizeRoles)(['reader', 'author', 'admin']), commentController_1.addCommentToPostHandler);
// DELETE /comments/:id - Delete a comment by ID (author or admin)
router.delete('/comments/:id', postMiddleware_1.default, (0, authorizeRole_1.authorizeRoles)(['author', 'admin']), commentController_1.deleteCommentHandler);
exports.default = router;
