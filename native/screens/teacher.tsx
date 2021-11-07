import React, { useState } from 'react';
import { View, StatusBar, ToastAndroid } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { useAuth } from '../utils/GlobalContext';
import { AvatarText, CapitalizeFirstLetter, SERVER_API } from '../utils/string';
import WavyHeader1 from '../components/waves/WavyHeader1';
import { FrontPageContainer } from '../components/FrontPageContainer';
import { SpeedDial } from 'react-native-elements';
import QRCode from 'react-qr-code';
import { useQuery } from 'react-query';
import { getQR } from '../queries/qr';
import { Splash } from '.';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { LinearGradient } from 'expo-linear-gradient';
import randomColor from 'randomcolor';
import { useKeepAwake } from 'expo-keep-awake';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Index2 is for teachers
export function TeacherScreen(props: NativeStackScreenProps<RootStackParamList, 'Teacher'>) {
	useKeepAwake();
	const { data, logout } = useAuth(props);
	const [avatarColor] = useState(randomColor({ luminosity: 'dark' }));

	const { data: qr, isSuccess } = useQuery('teacher_qr', async () => await getQR(data?.data.user), {
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});

	const [isDialOpen, setIsDialOpen] = useState(false);
	const user = data?.data.user;

	if (qr === null || qr === undefined || !isSuccess || user === undefined) {
		return <Splash text='Loading QR..' />;
	}

	const DownloadAttendance = async () => {
		if (user) {
			FileSystem.downloadAsync(SERVER_API + '/attendances/self', FileSystem.documentDirectory + 'self-attendance.xlsx', {
				headers: {
					Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
				},
			}).then((res) => {
				FileSystem.getContentUriAsync(res.uri).then((cUri) => {
					IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
						data: cUri,
						flags: 1,
					});
				});
			});
		} else ToastAndroid.show('User not found!', ToastAndroid.SHORT);
	};

	return (
		<View style={{ flex: 1 }}>
			<FrontPageContainer bg={0}>
				{/* Header */}
				<LinearGradient colors={['#f37335', '#c25c2a']} style={{ padding: 24 }}>
					<View
						style={{
							flexDirection: 'row',
							marginBottom: 24,
							marginTop: StatusBar.currentHeight || 24,
						}}>
						<View style={{ marginRight: 12 }}>
							<Avatar
								rounded
								title={AvatarText(user.name)}
								size='medium'
								overlayContainerStyle={{ backgroundColor: avatarColor }}
							/>
						</View>
						<View style={{ flexDirection: 'column', justifyContent: 'center' }}>
							<Text style={{ fontWeight: 'bold', color: 'white', fontSize: 18 }}>{user.name}</Text>
							<Text style={{ color: 'white' }}>{CapitalizeFirstLetter(user.role?.toLowerCase())}</Text>
						</View>
					</View>
					<View>
						<Text style={{ marginBottom: 8, color: 'white' }}>
							Present your QR code to authorized personnels to have your attendance.
						</Text>
					</View>
				</LinearGradient>
				<WavyHeader1 />

				{/* Body */}
				<View
					style={{
						alignItems: 'center',
						justifyContent: 'center',
						marginHorizontal: 24,
						paddingVertical: 24,
						backgroundColor: 'white',
						borderRadius: 24,
						shadowColor: '#000',
						shadowOffset: {
							width: 0,
							height: 2,
						},
						shadowOpacity: 0.25,
						shadowRadius: 3.84,
						elevation: 5,
						// flex: .8
					}}>
					<QRCode value={qr.data} />
				</View>
			</FrontPageContainer>

			<SpeedDial
				isOpen={isDialOpen}
				icon={{ name: 'add', color: '#fff' }}
				openIcon={{ name: 'close', color: '#fff' }}
				onOpen={() => setIsDialOpen(!isDialOpen)}
				onClose={() => setIsDialOpen(!isDialOpen)}
				buttonStyle={{ borderRadius: 32, backgroundColor: '#18a86b' }}>
				<SpeedDial.Action
					icon={{ name: 'logout', color: '#fff' }}
					buttonStyle={{ borderRadius: 32, backgroundColor: '#DC143C' }}
					title='Logout'
					onPress={() => logout()}
				/>
				<SpeedDial.Action
					icon={{ name: 'visibility', color: '#fff' }}
					title='View Attendance'
					buttonStyle={{ borderRadius: 32, backgroundColor: '#18a86b' }}
					onPress={() => props.navigation.navigate('User', { user })}
				/>
				<SpeedDial.Action
					icon={{ name: 'description', color: '#fff' }}
					title='Self Attendance Sheet'
					buttonStyle={{ borderRadius: 32, backgroundColor: '#18a86b' }}
					onPress={DownloadAttendance}
					titleStyle={{ paddingHorizontal: 6 }}
				/>
			</SpeedDial>
		</View>
	);
}
