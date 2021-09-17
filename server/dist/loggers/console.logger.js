"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
const chalk_1 = __importDefault(require("chalk"));
const dayjs_1 = __importDefault(require("dayjs"));
class ConsoleLogger {
    success(message, data = '') {
        console.log(chalk_1.default.green(`${this.date()} [success] ${message}`), data);
    }
    info(message, data = '') {
        console.log(chalk_1.default.blue(`${this.date()} [info] ${message}`), data);
    }
    warning(message, data = '') {
        console.log(chalk_1.default.yellow(`${this.date()} [warning] ${message}`), data);
    }
    error(message, data = '') {
        console.log(chalk_1.default.red(`${this.date()} [error] ${message}`), data);
    }
    date() {
        return `[${(0, dayjs_1.default)().format('MM-DD-YYYY hh:mm:ss A')}]`;
    }
}
exports.ConsoleLogger = ConsoleLogger;
