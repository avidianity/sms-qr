"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = require("path");
const dotenv_expand_1 = __importDefault(require("dotenv-expand"));
const path = (0, path_1.resolve)(__dirname, '../');
const env = dotenv_1.default.config({ path });
(0, dotenv_expand_1.default)(env);
