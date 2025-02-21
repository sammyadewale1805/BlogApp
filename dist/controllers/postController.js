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
exports.deletePostHandler = exports.updatePostHandler = exports.createPostHandler = exports.getPostByIdHandler = exports.getAllPostsHandler = void 0;
const mongoose_1 = require("mongoose"); // Import Types from mongoose
const postModel_1 = __importDefault(require("../models/postModel")); // Import IPost and Post
const typeGuards_1 = require("../utils/typeGuards"); // Import type guard
// Service functions (inline types)
const getAllPosts = (page, limit, filter) => __awaiter(void 0, void 0, void 0, function* () {
    return yield postModel_1.default.find(filter)
        .limit(limit)
        .skip((page - 1) * limit)
        .populate('author', 'username');
});
const getPostById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield postModel_1.default.findById(id).populate('author', 'username');
});
const createPost = (postData) => __awaiter(void 0, void 0, void 0, function* () {
    const post = new postModel_1.default(postData);
    return yield post.save();
});
const updatePost = (id, postData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield postModel_1.default.findByIdAndUpdate(id, postData, { new: true });
});
const deletePost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield postModel_1.default.findByIdAndDelete(id);
});
// Controller handlers
const getAllPostsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, title } = req.query;
        const filter = {};
        if (title)
            filter.title = { $regex: title, $options: 'i' };
        const posts = yield getAllPosts(Number(page), Number(limit), filter);
        return res.json(posts);
    }
    catch (err) {
        return res.status(500).json({ message: err instanceof Error ? err.message : 'Server error' });
    }
});
exports.getAllPostsHandler = getAllPostsHandler;
const getPostByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield getPostById(req.params.id);
        if (!post)
            return res.status(404).json({ message: 'Post not found' });
        return res.json(post);
    }
    catch (err) {
        return res.status(500).json({ message: err instanceof Error ? err.message : 'Server error' });
    }
});
exports.getPostByIdHandler = getPostByIdHandler;
// src/controllers/postController.ts
const createPostHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!mongoose_1.Types.ObjectId.isValid(req.user._id)) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }
        const postData = {
            title: req.body.title,
            content: req.body.content,
            author: req.user.id
        };
        const newPost = yield createPost(postData);
        return res.status(201).json(newPost);
    }
    catch (err) {
        return res.status(400).json({ message: err instanceof Error ? err.message : 'Bad request' });
    }
});
exports.createPostHandler = createPostHandler;
const updatePostHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const post = yield getPostById(req.params.id);
        if (!post)
            return res.status(404).json({ message: 'Post not found' });
        if (!(0, typeGuards_1.isValidObjectIdString)(req.user.id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this post' });
        }
        const updatedPost = yield updatePost(req.params.id, {
            title: req.body.title || post.title,
            content: req.body.content || post.content,
        });
        return res.json(updatedPost);
    }
    catch (err) {
        return res.status(400).json({ message: err instanceof Error ? err.message : 'Bad request' });
    }
});
exports.updatePostHandler = updatePostHandler;
const deletePostHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const post = yield getPostById(req.params.id);
        if (!post)
            return res.status(404).json({ message: 'Post not found' });
        // Ensure req.user._id is a valid ObjectId string
        if (!(0, typeGuards_1.isValidObjectIdString)(req.user.id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }
        yield deletePost(req.params.id);
        return res.json({ message: 'Post deleted' });
    }
    catch (err) {
        return res.status(500).json({ message: err instanceof Error ? err.message : 'Server error' });
    }
});
exports.deletePostHandler = deletePostHandler;
