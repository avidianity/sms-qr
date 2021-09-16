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
