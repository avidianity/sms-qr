"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
exports.default = {
    channel: (0, helpers_1.env)('LOG_CHANNEL', 'console'),
};
