"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    content: { type: String, required: true },
    post: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Comment', commentSchema);
