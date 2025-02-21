"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        console.log(req.user.role);
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'You are not authorized to perform this action.' });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
