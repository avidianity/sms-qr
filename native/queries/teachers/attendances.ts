import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Attendance } from '../../screens/scan';
import { User } from '../../types';
import { SERVER_API } from '../../utils/string';

export async function getAttendance(user: Partial<User> | undefined) {
	if (user === undefined) return null;

	const asToken = await AsyncStorage.getItem('token');

	if (asToken === null) return null;

	try {
		const get = await axios.get<Attendance[]>(SERVER_API + '/teachers/' + user.id + '/attendances', {
			headers: {
				Authorization: `Bearer ${asToken}`,
			},
		});
		return get;
	} catch (err) {
		// Clear storage if invalid auth
		await AsyncStorage.removeItem('token');
		await AsyncStorage.removeItem('user');
	}
}
