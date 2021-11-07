import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { User } from '../../types';
import { SERVER_API } from '../../utils/string';

export async function getAdmins() {
	try {
		const get = await axios.get<User[]>(SERVER_API + '/admins/', {
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
			},
		});
		return get;
	} catch (err) {
		// Clear storage if invalid auth
		await AsyncStorage.removeItem('token');
		await AsyncStorage.removeItem('user');
	}
}
