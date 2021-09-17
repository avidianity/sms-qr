import React, { useEffect } from 'react';
import { Login } from '../components/Login';
import { Register } from '../components/Register';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useGlobalContext } from '../utils/GlobalContext';
import { useQuery } from 'react-query';
import { getMe } from '../queries/auth/me';
import { Text } from 'react-native-elements';
import { View } from "react-native"
import { Index2Screen } from './index2';

const Tab = createMaterialTopTabNavigator();

export function IndexScreen() {

  const { token, setToken, setUser } = useGlobalContext()

  const {data, isLoading} = useQuery('me', async () => await getMe(token))

  useEffect(()=>{
    if (data?.data.token) setToken(data?.data.token)
    if (data?.data.user) setUser(data?.data.user)
  })

  if (isLoading && token.length > 0) return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Please wait...</Text>
    </View>
  )

  if (token.length === 0) {
    return (
      <Tab.Navigator>
        <Tab.Screen name='Login' component={Login}/>
        <Tab.Screen name='Register' component={Register}/>
      </Tab.Navigator>
    );
  }

  //Default
  return (<Index2Screen/>)
}

