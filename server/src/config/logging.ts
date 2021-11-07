import { env } from '../helpers';
import { ConsoleLogger } from '../loggers/console.logger';
import { FileLogger } from '../loggers/file.logger';

export default {
    channel: env('LOG_CHANNEL', 'console'),

    drivers: {
        console: ConsoleLogger,
        file: FileLogger,
    },
};
