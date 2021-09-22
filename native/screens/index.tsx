import React, { ReactChildren, ReactElement, useEffect, useState } from 'react';
import { Login } from '../components/Login';
import { Register } from '../components/Register';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useAuth } from '../utils/GlobalContext';
import { useQuery } from 'react-query';
import { getMe } from '../queries/auth/me';
import { Icon, Text } from 'react-native-elements';
import { ToastAndroid, View } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosResponse } from 'axios';
import { User, UserResponse } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

const Tab = createMaterialTopTabNavigator();

export function IndexScreen(props:NativeStackScreenProps<RootStackParamList, 'Welcome'>) {
  const { data, isSuccess } = useAuth(props)

  useEffect(()=> {
    async function asyncLogout() {
      ToastAndroid.show('Logged out successfully.', ToastAndroid.LONG)
      await AsyncStorage.removeItem('token')
    }  

    if (props?.route?.params?.method === 'logout') asyncLogout()
  }, [props.route.params])

  useEffect(()=>{
    if (!isSuccess || !data) return

    if (data.data.user.role === 'TEACHER') props.navigation.reset({index: 1, routes: [{ name: 'Teacher'}]})
    else if (data.data.user.role === 'ADMIN') props.navigation.reset({index: 1, routes: [{ name: 'Admin'}]})
  }, [data, isSuccess])

  if (!data && isSuccess) {
    return (
      <Tab.Navigator screenOptions={{tabBarStyle:{display:'none'}}}>
        <Tab.Screen name='Login' component={Login}/>
        <Tab.Screen name='Register' component={Register}/>
      </Tab.Navigator>
    )
  }
  
  return <Splash children={<Text>SMS-QR</Text>} />
}

interface ISplash {
  children?: ReactElement
}

export function Splash({children}:ISplash) {

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <Icon name='people' size={64}/>
      {children}
    </View>
  )
}