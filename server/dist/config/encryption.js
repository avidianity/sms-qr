"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const crypto_js_1 = require("crypto-js");
exports.default = {
    key: (0, helpers_1.env)('ENCRYPTION_KEY', 'secret'),
    driver: (0, helpers_1.env)('ENCRYPTION_DRIVER', 'rabbit'),
    drivers: {
        tripledes: crypto_js_1.TripleDES,
        aes: crypto_js_1.AES,
        rabbit: crypto_js_1.Rabbit,
    },
};
