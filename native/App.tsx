import React, { useEffect, useState } from 'react';
import { Text, ThemeProvider } from 'react-native-elements';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { IndexScreen } from './screens';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GlobalContext } from './utils/GlobalContext';
import { Token, User } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from 'react-query';
import { LogBox } from 'react-native';
import { ScanQRScreen } from './screens/scan';
import { Register } from './components/Register';
import { TeacherScreen } from './screens/teacher';
import { getMe } from './queries/auth/me';
import { AdminScreen } from './screens/admin';
import { AttendanceScreen } from './screens/attendances';

LogBox.ignoreLogs(['Setting a timer', 'React state update']);

const theme = {
  Button: {
    raised: true,
  },
};


const Stack = createNativeStackNavigator();
const queryClient = new QueryClient()

export default function App(props:any) {
  let colorScheme = useColorScheme()
  const [token, setToken] = useState<Token>('')
  const [user, setUser] = useState<Partial<User>>({})

  useEffect(()=> {
    (async ()=>{
      let data = await getMe()
      
      if (data) {
        setUser(data.data.user)
        if (typeof data.data.token === 'string') {
          setToken(data.data.token)
        }
      }
    })()
  }, [])

  useEffect(()=>{
    //Initialize global at start
    async function SetGlobal() {
      const tmpToken = await AsyncStorage.getItem('token')
      const tmpUser = await AsyncStorage.getItem('user')

      if (tmpToken && tmpToken.length > 0) setToken(tmpToken)
      if (tmpUser) setUser(JSON.parse(tmpUser))
    }

    SetGlobal()
  }, [])

  useEffect(()=>{
    (async ()=>{
      if ( user && Object.keys(user)?.length > 0) {
        await AsyncStorage.setItem('user', JSON.stringify(user))
      }
    })()
  }, [user])

  useEffect(()=> {
    (async ()=> {
      if (token?.length > 0) {
        await AsyncStorage.setItem('token', token)
      }
    })()
  }, [token])

  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <ThemeProvider theme={theme} useDark={colorScheme === 'dark'}>
          <NavigationContainer>
            <QueryClientProvider client={queryClient}>
              <GlobalContext.Provider value={{token, setToken, user, setUser}}>
                <Stack.Navigator initialRouteName='Welcome'>
                  <Stack.Screen 
                    name="Welcome"
                    component={IndexScreen}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Scan QR Code"
                    component={ScanQRScreen}
                    options={{
                      headerStyle: {backgroundColor: 'orange'}
                    }}
                  />
                  <Stack.Screen
                    name="Teacher"
                    component={TeacherScreen}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Admin"
                    component={AdminScreen}
                    options={{
                      title: 'Administrator Dashboard',
                      headerStyle: {backgroundColor: 'orange'}
                    }}
                  />
                  <Stack.Screen
                    name="Update"
                    component={Register}
                    options={{
                      headerTitle: ''
                    }}
                  />
                  <Stack.Screen
                    name="Attendance"
                    component={AttendanceScreen}
                  />
                </Stack.Navigator>
              </GlobalContext.Provider>
            </QueryClientProvider>
          </NavigationContainer>
        </ThemeProvider>
      </AppearanceProvider>
    </SafeAreaProvider>
  );

}

export type RootStackParamList = {
  Welcome: {method: 'logout'}
  Attendance: {user: Partial<User>}
  Teacher: undefined
  Admin: undefined
  'Scan QR Code': undefined
  Update: {
    method: 'add_teacher' | 'add_admin'
    user: User
  }
}