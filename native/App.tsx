import React from 'react';
import { ThemeProvider } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { IndexScreen } from './screens';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Roles, User } from './types';
import { QueryClient, QueryClientProvider } from 'react-query';
import { LogBox } from 'react-native';
import { ScanQRScreen } from './screens/scan';
import { Register } from './components/Register';
import { TeacherScreen } from './screens/teacher';
import { AdminScreen } from './screens/admin';
import { UserScreen } from './screens/user';

LogBox.ignoreLogs(['Setting a timer', 'React state update']);

const theme = {
	Button: {
		raised: true,
	},
};

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App(props: any) {
	let colorScheme = useColorScheme();
	return (
		<SafeAreaProvider>
			<AppearanceProvider>
				<ThemeProvider theme={theme} useDark={colorScheme === 'dark'}>
					<NavigationContainer>
						<QueryClientProvider client={queryClient}>
							<Stack.Navigator initialRouteName='Welcome'>
								<Stack.Screen name='Welcome' component={IndexScreen} options={{ headerShown: false }} />
								<Stack.Screen
									name='Scan QR Code'
									component={ScanQRScreen}
									options={{
										headerStyle: { backgroundColor: 'orange' },
									}}
								/>
								<Stack.Screen name='Teacher' component={TeacherScreen} options={{ headerShown: false }} />
								<Stack.Screen
									name='Admin'
									component={AdminScreen}
									options={{
										title: 'Administrator Dashboard',
										headerStyle: { backgroundColor: 'orange' },
									}}
								/>
								<Stack.Screen
									name='Update'
									component={Register}
									options={{
										headerTitle: '',
									}}
								/>
								<Stack.Screen
									name='User'
									component={UserScreen}
									options={{
										title: 'User',
									}}
								/>
							</Stack.Navigator>
						</QueryClientProvider>
					</NavigationContainer>
				</ThemeProvider>
			</AppearanceProvider>
		</SafeAreaProvider>
	);
}

export type RootStackParamList = {
	Welcome: { method: 'logout' };
	User: { user: Partial<User> };
	Teacher: undefined;
	Admin: undefined;
	'Scan QR Code': undefined;
	Update: {
		method?: `add_${Lowercase<Roles>}` | `update_${Lowercase<Roles>}`;
		user?: User;
	};
};
