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
exports.deletePost = exports.updatePost = exports.createPost = exports.getPostById = exports.getAllPosts = void 0;
// src/services/postService.ts
const postModel_1 = __importDefault(require("../models/postModel"));
const getAllPosts = (page, limit, filter) => __awaiter(void 0, void 0, void 0, function* () {
    return yield postModel_1.default.find(filter)
        .limit(limit)
        .skip((page - 1) * limit)
        .populate('author', 'username');
});
exports.getAllPosts = getAllPosts;
const getPostById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield postModel_1.default.findById(id).populate('author', 'username');
});
exports.getPostById = getPostById;
const createPost = (postData) => __awaiter(void 0, void 0, void 0, function* () {
    const post = new postModel_1.default(postData);
    return yield post.save();
});
exports.createPost = createPost;
const updatePost = (id, postData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield postModel_1.default.findByIdAndUpdate(id, postData, { new: true });
});
exports.updatePost = updatePost;
const deletePost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield postModel_1.default.findByIdAndDelete(id);
});
exports.deletePost = deletePost;
