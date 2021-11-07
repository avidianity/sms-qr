import { LoggerInterface } from '../interfaces/logger.interface';
import chalk from 'chalk';
import dayjs from 'dayjs';

export class ConsoleLogger implements LoggerInterface {
    success(message: string, ...data: any) {
        console.log(
            chalk.green(`${this.date()} [success] ${message}`),
            ...data
        );
    }

    info(message: string, ...data: any) {
        console.log(chalk.blue(`${this.date()} [info] ${message}`), ...data);
    }

    warning(message: string, ...data: any) {
        console.log(
            chalk.yellow(`${this.date()} [warning] ${message}`),
            ...data
        );
    }

    error(message: string, ...data: any) {
        console.log(chalk.red(`${this.date()} [error] ${message}`), ...data);
    }

    protected date() {
        return `[${dayjs().format('MM-DD-YYYY hh:mm:ss A')}]`;
    }
}
