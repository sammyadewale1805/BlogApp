"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userController_1 = require("../controllers/userController");
const authorizeRole_1 = require("../middlewares/authorizeRole");
const router = express_1.default.Router();
// Protect routes with authenticate and authorize middleware
router.get('/', authMiddleware_1.authenticate, (0, authorizeRole_1.authorizeRoles)(['admin']), userController_1.getAllUsers);
router.delete('/:id', authMiddleware_1.authenticate, (0, authorizeRole_1.authorizeRoles)(['admin']), userController_1.deleteUser);
router.put('/promote', authMiddleware_1.authenticate, (0, authorizeRole_1.authorizeRoles)(['admin']), userController_1.promoteUser);
exports.default = router;
