import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../utils/GlobalContext';
import { AvatarText, CapitalizeFirstLetter } from '../utils/string';
import WavyHeader1 from '../components/waves/WavyHeader1';
import { FrontPageContainer } from '../components/FrontPageContainer';
import { StatusBar } from 'expo-status-bar';
import { SpeedDial } from 'react-native-elements';
import QRCode from 'react-qr-code';
import { useQuery } from 'react-query';
import { getMe } from '../queries/auth/me';
import { getQR } from '../queries/qr';
import { Splash } from '.';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

//Index2 is for teachers
export function TeacherScreen(props:NativeStackScreenProps<RootStackParamList, 'Teacher'>) {
  const { user, token } = useGlobalContext(props)

  const { data, isSuccess } = useQuery('teacher_qr', async () => await getQR(user, token), {refetchOnMount: false, refetchOnReconnect: false, refetchOnWindowFocus: false})
  const [isDialOpen, setIsDialOpen] = useState(false)

  if (data === null || data === undefined || !isSuccess) {
    return <Splash children={<Text>Loading QR..</Text>}/>
  }

  const handleLogout = async () => {
    props.navigation.navigate('Welcome', {method: 'logout'})
  }

  return (
    <View style={{flex:1}}>
      <StatusBar backgroundColor='#f37335' style='light' />
      <FrontPageContainer bg={0} onSafeArea>
        {/* Header */}
        <View style={{backgroundColor: '#f37335', padding: 24}}>
          <View style={{flexDirection: 'row', marginBottom:24}}>
            <View style={{marginRight: 12}}>
              <Avatar 
                rounded
                title={AvatarText(user.name)}
                size='medium'
                overlayContainerStyle={{backgroundColor: 'green'}}
              />
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center'}}>
              <Text style={{fontWeight: 'bold', color: 'white', fontSize: 18}}>{user.name}</Text>
              <Text style={{color: 'white'}}>{CapitalizeFirstLetter(user.role?.toLowerCase())}</Text>
            </View>
          </View>
          <View>
            <Text style={{marginBottom: 8, color: 'white'}}>Present your QR code to authorized personnels to have your attendance.</Text>
          </View>
        </View>
        <WavyHeader1/>
      
        {/* Body */}
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 24,
          paddingVertical: 24,
          backgroundColor: 'white',
          borderRadius: 24,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          // flex: .8
        }}>
          <QRCode value={data.data}/>
        </View>
      </FrontPageContainer>

      <SpeedDial
        isOpen={isDialOpen}
        icon={{ name: 'add', color: '#fff' }}
        openIcon={{ name: 'close', color: '#fff' }}
        onOpen={() => setIsDialOpen(!isDialOpen)}
        onClose={() => setIsDialOpen(!isDialOpen)}
        buttonStyle={{borderRadius: 32, backgroundColor: '#18a86b'}}
      >
        <SpeedDial.Action
          icon={{ name: 'logout', color: '#fff' }}
          buttonStyle={{borderRadius: 32, backgroundColor: '#18a86b'}}
          title="Logout"
          onPress={handleLogout}
        />
        <SpeedDial.Action
          icon={{ name: 'visibility', color: '#fff' }}
          title="View Attendance"
          buttonStyle={{borderRadius: 32, backgroundColor: '#18a86b'}}
          onPress={()=>props.navigation.navigate('Attendance', {user})}
        />
      </SpeedDial>

    </View>
  );
}