"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
exports.default = {
    token: (0, helpers_1.env)('SEMAPHORE_TOKEN', 'null'),
    urls: {
        dev: (0, helpers_1.env)('SEMAPHORE_DEV_SERVER', 'http://localhost:3535'),
        prod: (0, helpers_1.env)('SEMAPHORE_PROD_SERVER', 'https://api.semaphore.com/api/v4'),
    },
};
