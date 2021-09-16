import { env } from '../helpers';

export default {
    key: env('JWT_KEY', 'secret'),
    expiry: env('JWT_EXPIRY', '4h'),
};
