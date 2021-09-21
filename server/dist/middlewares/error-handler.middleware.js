"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const helpers_1 = require("../helpers");
const logger = (0, helpers_1.getLogger)();
function errorHandler(error, _req, res, _next) {
    logger.error(error.message);
    return res.status(error.status || 500).json(error.toObject());
}
exports.errorHandler = errorHandler;
