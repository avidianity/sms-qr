"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const console_logger_1 = require("../loggers/console.logger");
exports.default = {
    channel: (0, helpers_1.env)('LOG_CHANNEL', 'console'),
    drivers: {
        console: console_logger_1.ConsoleLogger,
    },
};
