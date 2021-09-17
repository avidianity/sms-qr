"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
exports.default = {
    key: (0, helpers_1.env)('JWT_KEY', 'secret'),
    expiry: (0, helpers_1.env)('JWT_EXPIRY', '4h'),
};
