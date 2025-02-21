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
exports.promoteUser = exports.deleteUser = exports.getAllUsers = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const errorHandler_1 = require("../utils/errorHandler");
const mongoose_1 = require("mongoose");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = '1', limit = '10', role } = req.query;
        // Convert page and limit to numbers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        // Validate page and limit
        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
            return res.status(400).json({ message: 'Invalid page or limit value.' });
        }
        const query = {};
        if (role)
            query.role = role;
        const users = yield userModel_1.default.find(query)
            .select('-password')
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);
        res.status(200).json(users);
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(res, error);
    }
});
exports.getAllUsers = getAllUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        // Check if the ID is a valid ObjectId
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }
        // Use type assertion to tell TypeScript that req.user._id is a string
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === id) {
            return res.status(400).json({ message: 'You cannot delete yourself.' });
        }
        const user = yield userModel_1.default.findByIdAndDelete(id);
        if (!user)
            return res.status(404).json({ message: 'User not found.' });
        res.status(200).json({ message: 'User deleted successfully.' });
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(res, error);
    }
});
exports.deleteUser = deleteUser;
const promoteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, role } = req.body;
        // Validate the role
        const validRoles = ['admin', 'author'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role.' });
        }
        // Find the user and update their role
        const user = yield userModel_1.default.findByIdAndUpdate(userId, { role }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'User role updated successfully.', user });
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(res, error);
    }
});
exports.promoteUser = promoteUser;
