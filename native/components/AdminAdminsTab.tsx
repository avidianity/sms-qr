import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { useQuery } from 'react-query';
import { getAdmins } from '../queries/admins';
import { UserCard } from './UserCard';

export function AdminAdminsTab(props: MaterialTopTabBarProps) {
	const { data, isLoading, refetch } = useQuery('admins', async () => getAdmins());

	return (
		<View style={{ flex: 1 }}>
			<ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => refetch()} />}>
				{data?.data.map((user, key) => (
					<UserCard refetch={refetch} user={user} key={key} navigation={props.navigation} />
				))}
				<View style={{ borderRadius: 8, height: 92 }}>
					<Pressable
						onPress={() => props.navigation.navigate('Update', { method: 'add_admin' })}
						android_ripple={{ color: '#18a86b', radius: 8 }}
						style={{
							flex: 1,
							borderRadius: 8,
							backgroundColor: '#f373353',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<Icon name='add' iconStyle={{ color: '#f37335', fontSize: 32 }} />
						<Text style={{ color: '#f37335' }}>Add Admin</Text>
					</Pressable>
				</View>
			</ScrollView>
		</View>
	);
}
