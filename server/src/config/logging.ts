import { env } from '../helpers';

export default {
	channel: env('LOG_CHANNEL', 'console'),
};
