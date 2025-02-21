"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentHandler = exports.addCommentToPostHandler = exports.getCommentsForPostHandler = void 0;
const commentService_1 = require("../services/commentService");
const postModel_1 = __importDefault(require("../models/postModel"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
// Get all comments for a post
const getCommentsForPostHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        // Check if the post exists
        const post = yield postModel_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const comments = yield (0, commentService_1.getCommentsForPost)(postId);
        return res.json(comments);
    }
    catch (err) {
        return res.status(500).json({ message: err instanceof Error ? err.message : 'Server error' });
    }
});
exports.getCommentsForPostHandler = getCommentsForPostHandler;
// Add a comment to a post
const addCommentToPostHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const post = yield postModel_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        // Add the comment
        const newComment = yield (0, commentService_1.addCommentToPost)(postId, content, req.user.id);
        return res.status(201).json(newComment);
    }
    catch (err) {
        console.error('Error in addCommentToPostHandler:', err);
        return res.status(400).json({ message: err instanceof Error ? err.message : 'Bad request' });
    }
});
exports.addCommentToPostHandler = addCommentToPostHandler;
// Delete a comment by ID
const deleteCommentHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const comment = yield commentModel_1.default.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        // Check if the user is the author or an admin
        if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }
        yield (0, commentService_1.deleteComment)(id);
        return res.json({ message: 'Comment deleted successfully' });
    }
    catch (err) {
        return res.status(500).json({ message: err instanceof Error ? err.message : 'Server error' });
    }
});
exports.deleteCommentHandler = deleteCommentHandler;
