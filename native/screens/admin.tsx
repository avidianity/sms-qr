import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { Fragment, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SpeedDial } from 'react-native-elements';
import { AdminAdminsTab } from '../components/AdminAdminsTab';
import { AdminTeachersTab } from '../components/AdminTeachersTab';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useAuth } from '../utils/GlobalContext';
import { Linking, ToastAndroid } from 'react-native';
import { API_URI } from '@env';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IProps {
  onLogout(): {}
  navigation: any
}

const Tab = createMaterialTopTabNavigator();

// Index3 is for admin
export function AdminScreen (props:NativeStackScreenProps<RootStackParamList, 'Admin'>) {
  const {data, logout} = useAuth(props)
  const user = data?.data.user
  const [isDialOpen, setIsDialOpen] = useState(false);

  const DownloadAttendance = async () => {
    if (user) {
      FileSystem.downloadAsync(
        API_URI+'/attendances/attendances',
        FileSystem.documentDirectory+'attendance.xlsx',
        {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
          }
        }
      ).then((res)=>{
        FileSystem.getContentUriAsync(res.uri).then(cUri => {
          IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: cUri,
            flags: 1,
          });
        });
      })
    }
    else ToastAndroid.show('User not found!', ToastAndroid.SHORT)
  }
  
  return (
    <Fragment>
      <StatusBar backgroundColor='orange' style='dark' />
      
      <Tab.Navigator>
        <Tab.Screen name='Teachers' component={AdminTeachersTab}/>
        <Tab.Screen name='Admins' component={AdminAdminsTab}/>
      </Tab.Navigator>
      
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
          buttonStyle={{borderRadius: 32, backgroundColor: '#DC143C'}}
          title="Logout"
          onPress={async ()=> await logout()}
          titleStyle={{paddingHorizontal: 6}}
        />
        <SpeedDial.Action
          icon={{ name: 'camera', color: '#fff' }}
          title="Scan QR Code"
          buttonStyle={{borderRadius: 32, backgroundColor: '#18a86b'}}
          onPress={()=>props.navigation.navigate('Scan QR Code')}
          titleStyle={{paddingHorizontal: 6}}
        />
        <SpeedDial.Action
          icon={{ name: 'description', color: '#fff' }}
          title="Monthly Attendance Sheet"
          buttonStyle={{borderRadius: 32, backgroundColor: '#18a86b'}}
          onPress={DownloadAttendance}
          titleStyle={{paddingHorizontal: 6}}
        />
      </SpeedDial>
    </Fragment>
  )
}