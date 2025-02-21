"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidObjectIdString = void 0;
// src/utils/typeGuards.ts
const mongoose_1 = require("mongoose");
const isValidObjectIdString = (value) => {
    return typeof value === 'string' && mongoose_1.Types.ObjectId.isValid(value);
};
exports.isValidObjectIdString = isValidObjectIdString;
