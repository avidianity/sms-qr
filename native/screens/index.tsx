import React, { useEffect, useRef, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useAuth } from '../utils/GlobalContext';
import { Icon,  Text } from 'react-native-elements';
import { Easing, StyleProp, StyleSheet, TextStyle, ToastAndroid, View } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { LinearGradient } from 'expo-linear-gradient';
import {Animated} from 'react-native';
import { Login } from '../components/Login';
import { Register } from '../components/Register';

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
  
  return <Splash text='SMS-QR' />
}

interface ISplash {
  text: string
  textStyle?: StyleProp<TextStyle>
}



export function Splash(
  {
    text, 
    textStyle
  }:ISplash) 
{
  const animation = useRef(new Animated.Value(0)).current

  useEffect(()=> {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: -15,
          duration: 1000,
          easing: Easing.sin,
          useNativeDriver: true
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 500,
          easing: Easing.bounce,
          useNativeDriver: true
        }),
      ])
    )

    
    anim.start()

  }, []);

  const trans={
    transform: [
      {
        translateY: animation
      }
    ]
  }

  return (
    <LinearGradient colors={['#f37335', '#18a86b']} style={{flex:1}}>
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <Animated.View style={[SplashStyle.iconView, trans]} >
          <Icon name='qrcode' type='fontisto' size={64} color='white'/>
        </Animated.View>
        <Text style={[textStyle, SplashStyle.textStyleDefault]}>{text}</Text>
      </View>
    </LinearGradient>
  )
}

const SplashStyle = StyleSheet.create({
  iconView: {
    marginBottom: 12
  },

  textStyleDefault: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 21,
    fontFamily: ''
  }
})