import React, { ReactChildren, ReactElement, useEffect, useState } from 'react';
import { Login } from '../components/Login';
import { Register } from '../components/Register';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useGlobalContext } from '../utils/GlobalContext';
import { useQuery } from 'react-query';
import { getMe } from '../queries/auth/me';
import { Icon, Text } from 'react-native-elements';
import { View } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosResponse } from 'axios';
import { User, UserResponse } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

const Tab = createMaterialTopTabNavigator();

export function IndexScreen(props:NativeStackScreenProps<RootStackParamList, 'Welcome'>) {

  const method = props?.route?.params?.method
  const { token, setToken, setUser, user } = useGlobalContext()

  const [data, setData] = useState<AxiosResponse<UserResponse> | null>()

  useEffect(()=>{
    if (method === 'logout') {

      (async ()=> {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
      })()

      setToken('');
      setUser({});

      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      })
    }
  }, [method])

  useEffect(() =>{
    if (data?.data.token) setToken(data?.data.token)
    if (data?.data.user) setUser(data?.data.user)
    
    async function reroute() {
      const res = await getMe()
        if (res !== null && res !== undefined)
          setData(res);
      
      const asUser = await AsyncStorage.getItem('user')

      if (typeof asUser === null || asUser === null) return

      const parsedUser:User = JSON.parse(asUser)

      if (parsedUser.role === 'TEACHER') props.navigation.reset({index: 0, routes: [{ name: 'Teacher'}]})
      else if (parsedUser.role === 'ADMIN') props.navigation.reset({index: 0, routes: [{ name: 'Admin'}]})
    }

    reroute()
  }, [data, token, user])

  if (token.length === 0 || data === null) {
    return (
      <Tab.Navigator screenOptions={{tabBarStyle:{display:'none'}}}>
        <Tab.Screen name='Login' component={Login}/>
        <Tab.Screen name='Register' component={Register}/>
      </Tab.Navigator>
    )
  }

  return <Splash children={<Text>Please wait...</Text>} />
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