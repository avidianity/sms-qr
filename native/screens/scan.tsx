import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import { BarCodeScannedCallback, BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import { Text } from 'react-native-elements';
import { Splash } from '.';
import { RootStackParamList } from '../App';
import { User } from '../types';
import { useAuth } from '../utils/GlobalContext';
import { SERVER_API } from '../utils/string';

export interface Attendance {
	createdAt: string;
	id: number;
	updatedAt: string;
	userId: number;
}

export interface ParseResponse {
	attendance: Attendance;
	teacher: User;
}

export function ScanQRScreen(props: NativeStackScreenProps<RootStackParamList, 'Scan QR Code'>) {
	const [hasPermission, setHasPermission] = useState<boolean>(false);

	const [posting, setPosting] = useState(false);
	const { data } = useAuth(props);

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestPermissionsAsync();
			setHasPermission(status === 'granted');
		})();
	}, []);

	const handleBarCodeScanned: BarCodeScannedCallback = (res) => {
		if (!posting) {
			ToastAndroid.show(`Posting...`, ToastAndroid.SHORT);
			setPosting(true);

			setTimeout(() => {
				// 1 second debounced
				axios
					.post<ParseResponse>(
						SERVER_API + '/qr/parse',
						{ payload: res.data },
						{
							headers: {
								Authorization: `Bearer ${data?.data.token}`,
							},
						}
					)
					.then((res) => {
						setPosting(false);
						ToastAndroid.show(`Successfully updated attendance for ${res.data.teacher.name}`, ToastAndroid.LONG);
						props.navigation.navigate('User', { user: res.data.teacher });
					})
					.catch((err: Error) => {
						setPosting(false);
						ToastAndroid.show(`Unable to post attendance for teacher. Error: ${err.message}`, ToastAndroid.LONG);
					});
			}, 1000);
		}
	};

	if (hasPermission) {
		return (
			<BarCodeScanner onBarCodeScanned={handleBarCodeScanned} style={styles.camera}>
				<View style={{ flex: 1 }}>
					<BarcodeMask width={250} height={250} edgeBorderWidth={10} animatedLineWidth={240} />
					<View style={{ flex: 1, flexGrow: 1 }}>
						<Text style={styles.bartext}>Please point the scanner into the QR code of the teacher.</Text>
					</View>
				</View>
			</BarCodeScanner>
		);
	} else {
		return <Splash text='Waiting for camera permission...' />;
	}
}

const styles = StyleSheet.create({
	camera: {
		width: '100%',
		height: '100%',
		flex: 1,
		backgroundColor: 'black',
	},
	buttonContainer: {},
	button: {},
	bartext: {
		color: 'white',
		marginTop: 'auto',
		marginBottom: 32,
		paddingHorizontal: 16,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
