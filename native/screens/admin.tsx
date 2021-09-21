import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { Fragment, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SpeedDial } from 'react-native-elements';
import { AdminAdminsTab } from '../components/AdminAdminsTab';
import { AdminTeachersTab } from '../components/AdminTeachersTab';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useDownloadAttendance } from '../components/UseDownloadAttendance';

interface IProps {
  onLogout(): {}
  navigation: any
}

const Tab = createMaterialTopTabNavigator();

// Index3 is for admin
export function AdminScreen (props:NativeStackScreenProps<RootStackParamList, 'Admin'>) {
  const {DownloadAttendance} = useDownloadAttendance(props)
  const [isDialOpen, setIsDialOpen] = useState(false);

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
          buttonStyle={{borderRadius: 32, backgroundColor: '#18a86b'}}
          title="Logout"
          onPress={()=>{
            props.navigation.navigate('Welcome', {method: 'logout'})
          }}
          
        />
        <SpeedDial.Action
          icon={{ name: 'camera', color: '#fff' }}
          title="Scan QR Code"
          buttonStyle={{borderRadius: 32, backgroundColor: '#18a86b'}}
          onPress={()=>props.navigation.navigate('Scan QR Code')}
        />
        <SpeedDial.Action
          icon={{ name: 'description', color: '#fff' }}
          title="Download Monthly Attendance Sheet"
          buttonStyle={{borderRadius: 32, backgroundColor: '#18a86b'}}
          onPress={DownloadAttendance}
        />
      </SpeedDial>
    </Fragment>
  )
}