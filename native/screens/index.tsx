import React, { useEffect, useState } from 'react';
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
import { UserResponse } from '../types';

const Tab = createMaterialTopTabNavigator();

type IndexMethods = 'logout'

export function IndexScreen(props:any) {

  const method = props?.route?.params?.method
  const { token, setToken, setUser, user } = useGlobalContext()

  const [data, setData] = useState<AxiosResponse<UserResponse>>()

  useEffect(()=>{
    (
      async () => {
        const res = await getMe()

        if (res !== null && res !== undefined)
          setData(res)
      }
    )()
  }, [method, token])

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

    if (data?.data.user.role === 'TEACHER') props.navigation.reset({index: 0, routes: [{ name: 'Teacher'}]})
    else if (data?.data.user.role === 'ADMIN') props.navigation.reset({index: 0, routes: [{ name: 'Admin'}]})
  }, [data])

  if (token.length === 0) {
    return (
      <Tab.Navigator screenOptions={{tabBarStyle:{display:'none'}}}>
        <Tab.Screen name='Login' component={Login}/>
        <Tab.Screen name='Register' component={Register}/>
      </Tab.Navigator>
    )
  }

  return <Splash />
}

function Splash() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Icon name='people' size={64}/>
    </View>
  )
}