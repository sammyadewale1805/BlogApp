"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// models/Post.ts
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Post', postSchema);
