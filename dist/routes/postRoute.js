"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/posts.ts
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controllers/postController");
const postMiddleware_1 = __importDefault(require("../middlewares/postMiddleware"));
const authorizeRole_1 = require("../middlewares/authorizeRole");
const router = express_1.default.Router();
router.get('/', postController_1.getAllPostsHandler);
router.get('/:id', postController_1.getPostByIdHandler);
router.post('/', postMiddleware_1.default, (0, authorizeRole_1.authorizeRoles)(['author']), postController_1.createPostHandler);
router.put('/:id', postMiddleware_1.default, postController_1.updatePostHandler);
router.delete('/:id', postMiddleware_1.default, postController_1.deletePostHandler);
exports.default = router;
