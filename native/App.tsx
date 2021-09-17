import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { IndexScreen } from './screens';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GlobalContext } from './utils/GlobalContext';
import { Token, User } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from 'react-query';

const theme = {
  Button: {
    raised: true,
  },
};


const Stack = createNativeStackNavigator();
const queryClient = new QueryClient()

export default function App() {
  let colorScheme = useColorScheme()
  const [token, setToken] = useState<Token>('')
  const [user, setUser] = useState<Partial<User>>({})

  useEffect(()=>{
    (async ()=>{
      const tmpToken = await AsyncStorage.getItem('token')
      const tmpUser = await AsyncStorage.getItem('user')

      if (tmpToken) setToken(tmpToken)
      else setToken('')

      if (tmpUser) setUser(JSON.parse(tmpUser))
      else setUser({})
    })()
  }, [token])

  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <ThemeProvider theme={theme} useDark={colorScheme === 'dark'}>
          <NavigationContainer>
            <QueryClientProvider client={queryClient}>
              <GlobalContext.Provider value={{token, setToken, user, setUser}}>
                <Stack.Navigator>
                  <Stack.Screen 
                    name="Welcome to SMS-QR!"
                    component={IndexScreen}
                    options={{
                      headerShown: !(token.length>0)
                    }}
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
