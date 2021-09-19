import { BarCodeScannedCallback, BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-elements';

export function ScanQRScreen() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned:BarCodeScannedCallback = (res) => {
    setScanned(true)
    Alert.alert('Data', res.data, [
      {
        text: 'Ok',
        onPress: () => setScanned(false)
      }
    ])
  }

  if (hasPermission) {
    return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={styles.camera}
    />
    )
  } else {
    return <Text>No access to camera</Text>
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