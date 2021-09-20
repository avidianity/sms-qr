import { API_URI } from '@env';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import { BarCodeScannedCallback, BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, ToastAndroid, View } from 'react-native'
import BarcodeMask from 'react-native-barcode-mask';
import { Text } from 'react-native-elements';
import { ScreenProps, ScreenStackProps } from 'react-native-screens';
import { Splash } from '.';
import { RootStackParamList } from '../App';
import { User } from '../types';
import { useGlobalContext } from '../utils/GlobalContext';

export interface Attendance {
  createdAt: string
  id: number
  updatedAt: string
  userId: number
}

export interface ParseResponse {
  attendance: Attendance
  teacher: User
}

export function ScanQRScreen(props:NativeStackScreenProps<RootStackParamList, 'Scan QR Code'>) {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanned, setScanned] = useState(false);
  const [posting, setPosting] = useState(false);
  const { token } = useGlobalContext();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned:BarCodeScannedCallback = (res) => {
    ToastAndroid.show(`Posting...`, ToastAndroid.SHORT)
    setPosting(true)
    if (!posting) {
      setTimeout(()=>{
        // 1 second debounced
        axios.post<ParseResponse>(API_URI+'/qr/parse', {payload: res.data}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then((res)=> {
          setPosting(false)
          ToastAndroid.show(`Successfully updated attendance for ${res.data.teacher.name}`, ToastAndroid.LONG)
          props.navigation.goBack()
        })
      }, 1000)
    }
    
  }

  if (hasPermission) {
    return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={styles.camera}
    >
      <BarcodeMask  />
    </BarCodeScanner>
    )
  } else {
    return <Splash children={<Text style={{color: 'red'}}>Can't access camera!</Text>}/>
  }
}

const styles = StyleSheet.create({
  camera: {
    width: '100%',
    height: '100%'
  },
  buttonContainer: {
  },
  button: {
    
  },
  text: {
    color: 'white'
  }
})