import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {View} from 'react-native';
import { Button, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../utils/GlobalContext';

export function Index2Screen() {
  const { setUser, setToken } = useGlobalContext()
  return (
    <SafeAreaView>
      <View>
        <Text>Test</Text>
        <Button title='Logout' onPress={async ()=>{
          await AsyncStorage.removeItem('user')
          await AsyncStorage.removeItem('token')
          setUser({})
          setToken('')
        }}/>
      </View>
    </SafeAreaView> 
  );
}

