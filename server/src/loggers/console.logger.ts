import { LoggerInterface } from '../interfaces/logger.interface';
import chalk from 'chalk';

export class ConsoleLogger implements LoggerInterface {
    success(message: string, data: any = '') {
        console.log(chalk.green(message), data);
    }

    info(message: string, data: any = '') {
        console.log(chalk.blue(message), data);
    }

    warning(message: string, data: any = '') {
        console.log(chalk.yellow(message), data);
    }

    error(message: string, data: any = '') {
        console.log(chalk.red(message), data);
    }
}
