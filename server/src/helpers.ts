import { enc } from 'crypto-js';
import { LoggerInterface } from './interfaces/logger.interface';
import { ConsoleLogger } from './loggers/console.logger';

export function registerLoggers(): any {
    return {
        console: ConsoleLogger,
    };
}

export function env(name: string, defaultValue = '') {
    const value = process.env[name];
    return value || defaultValue;
}

export function config(name: string) {
    const parts = name.split('.');
    const key = parts.shift();
    let config = require(`./config/${key}`).default;

    parts.forEach((part) => (config = config[part]));

    return config;
}

export function getLogger(): LoggerInterface {
    const className = config('logging.channel');
    const loggers: any = registerLoggers();

    return new loggers[className]();
}

export class Crypto {
    static encrypt(data: any): string {
        const key = config('encryption.key');
        const driver = config('encryption.driver');
        const cipher = config(`encryption.drivers.${driver}`);

        return cipher
            .encrypt(
                typeof data === 'string' ? data : JSON.stringify(data),
                key
            )
            .toString();
    }

    static decrypt<T = any>(payload: string): T {
        const key = config('encryption.key');
        const driver = config('encryption.driver');
        const cipher = config(`encryption.drivers.${driver}`);

        return JSON.parse(cipher.decrypt(payload, key).toString(enc.Utf8));
    }
}
