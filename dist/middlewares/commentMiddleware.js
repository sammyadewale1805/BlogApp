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
exports.commentMiddleware = void 0;
const commentModel_1 = __importDefault(require("../models/commentModel"));
// Middleware to validate commentId and check if the comment exists
const commentMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const comment = yield commentModel_1.default.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        // Attach the comment to the request object for use in the controller
        req.comment = comment;
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.commentMiddleware = commentMiddleware;
