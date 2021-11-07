import config from './config.json';

process.env.API_URI = config.API_URI;
process.env.ENV = config.ENV;

export default {
	name: 'SMS-QR',
	version: '1.0.0',
	extra: {
		SERVER_API: process.env.API_URI || 'https://sms-qr-api.tk',
		ENVIRONMENT: process.env.ENV || 'dev',
	},
	orientation: 'portrait',
	icon: './assets/icon.png',
	splash: {
		image: './assets/splash.png',
		resizeMode: 'contain',
		backgroundColor: '#ffffff',
	},
	android: {
		package: 'smsqr.android',
	},
};
