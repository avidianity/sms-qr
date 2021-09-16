export interface LoggerInterface {
	success(message: string, data?: any): void;
	info(message: string, data?: any): void;
	warning(message: string, data?: any): void;
	error(message: string, data?: any): void;
}
