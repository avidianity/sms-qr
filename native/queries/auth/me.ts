import { Token, UserResponse } from '../../types';
import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_API } from '../../utils/string';

export async function getMe() {
	const asToken = await AsyncStorage.getItem('token');

	if (asToken === null) return null;

	try {
		const get = await axios.get<UserResponse>(SERVER_API + '/auth/check', {
			headers: {
				Authorization: `Bearer ${asToken}`,
			},
		});
		return get;
	} catch (err) {
		await AsyncStorage.removeItem('token');
	}

	return null;
}
