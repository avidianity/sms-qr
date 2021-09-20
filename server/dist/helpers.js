"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypto = exports.getLogger = exports.config = exports.env = exports.registerLoggers = void 0;
const crypto_js_1 = require("crypto-js");
const console_logger_1 = require("./loggers/console.logger");
function registerLoggers() {
    return {
        console: console_logger_1.ConsoleLogger,
    };
}
exports.registerLoggers = registerLoggers;
function env(name, defaultValue = '') {
    const value = process.env[name];
    return value || defaultValue;
}
exports.env = env;
function config(name) {
    const parts = name.split('.');
    const key = parts.shift();
    let config = require(`./config/${key}`).default;
    parts.forEach((part) => (config = config[part]));
    return config;
}
exports.config = config;
function getLogger() {
    const className = config('logging.channel');
    const loggers = registerLoggers();
    return new loggers[className]();
}
exports.getLogger = getLogger;
class Crypto {
    static encrypt(data) {
        const key = config('encryption.key');
        const driver = config('encryption.driver');
        const cipher = config(`encryption.drivers.${driver}`);
        return cipher
            .encrypt(typeof data === 'string' ? data : JSON.stringify(data), key)
            .toString();
    }
    static decrypt(payload) {
        const key = config('encryption.key');
        const driver = config('encryption.driver');
        const cipher = config(`encryption.drivers.${driver}`);
        return JSON.parse(cipher.decrypt(payload, key).toString(crypto_js_1.enc.Utf8));
    }
}
exports.Crypto = Crypto;