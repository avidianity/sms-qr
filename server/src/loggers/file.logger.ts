import { LoggerInterface } from '../interfaces/logger.interface';
import dayjs from 'dayjs';
import { LocalFilesystem } from '../filesystems/local.filesystem';

export class FileLogger implements LoggerInterface {
    protected storage = new LocalFilesystem();

    success(message: string, ...data: any) {
        this.storage.writeSync(
            'smsqr.logs',
            `${this.date()} [success] ${JSON.stringify(message, null, '\t')}${
                data ? ` ${JSON.stringify(data, null, '\t')}` : ''
            }\n`,
            { flag: 'a' }
        );
    }

    info(message: string, ...data: any) {
        this.storage.writeSync(
            'smsqr.logs',
            `${this.date()} [info] ${JSON.stringify(message, null, '\t')}${
                data ? ` ${JSON.stringify(data, null, '\t')}` : ''
            }\n`,
            { flag: 'a' }
        );
    }

    warning(message: string, ...data: any) {
        this.storage.writeSync(
            'smsqr.logs',
            `${this.date()} [warning] ${JSON.stringify(message, null, '\t')}${
                data ? ` ${JSON.stringify(data, null, '\t')}` : ''
            }\n`,
            { flag: 'a' }
        );
    }

    error(message: string, ...data: any) {
        this.storage.writeSync(
            'smsqr.logs',
            `${this.date()} [error] ${JSON.stringify(message, null, '\t')}${
                data ? ` ${JSON.stringify(data, null, '\t')}` : ''
            }\n`,
            { flag: 'a' }
        );
    }

    protected date() {
        return `[${dayjs().format('MM-DD-YYYY hh:mm:ss A')}]`;
    }
}
