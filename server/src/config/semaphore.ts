import { env } from '../helpers';

export default {
    token: env('SEMAPHORE_TOKEN', 'null'),

    urls: {
        dev: env('SEMAPHORE_DEV_SERVER', 'http://localhost:3535'),
        prod: env('SEMAPHORE_PROD_SERVER', 'https://api.semaphore.com/api/v4'),
    },
};
