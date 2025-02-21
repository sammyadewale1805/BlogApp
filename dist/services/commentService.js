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
exports.deleteComment = exports.addCommentToPost = exports.getCommentsForPost = void 0;
const commentModel_1 = __importDefault(require("../models/commentModel"));
// Get all comments for a post
const getCommentsForPost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield commentModel_1.default.find({ post: postId }).populate('author', 'username');
});
exports.getCommentsForPost = getCommentsForPost;
// Add a comment to a post
const addCommentToPost = (postId, content, authorId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = new commentModel_1.default({ content, post: postId, author: authorId });
    return yield comment.save();
});
exports.addCommentToPost = addCommentToPost;
// Delete a comment by ID
const deleteComment = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    yield commentModel_1.default.findByIdAndDelete(commentId);
});
exports.deleteComment = deleteComment;
