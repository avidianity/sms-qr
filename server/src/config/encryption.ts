import { env } from '../helpers';
import { Rabbit, AES, TripleDES } from 'crypto-js';

export default {
    key: env('ENCRYPTION_KEY', 'secret'),

    driver: env('ENCRYPTION_DRIVER', 'rabbit'),

    drivers: {
        tripledes: TripleDES,
        aes: AES,
        rabbit: Rabbit,
    },
};
