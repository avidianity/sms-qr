import { LocalFilesystem } from '../filesystems/local.filesystem';
import { env } from '../helpers';

export default {
    driver: env('FILESYSTEM_DRIVER', 'local'),

    drivers: {
        local: LocalFilesystem,
    },
};
