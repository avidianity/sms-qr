import React, { Fragment, useState } from 'react';
import { User } from '../../types';
import { Avatar, Icon, Overlay, Text, Button } from 'react-native-elements'
import { Card } from 'react-native-elements/dist/card/Card'
import { AvatarText, CapitalizeFirstLetter } from '../../utils/string';
import { View, ToastAndroid } from 'react-native';
import randomColor from 'randomcolor';
import axios from 'axios';
import { API_URI } from '@env';
import { NavigationHelpers } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IProps {
  user: User
  navigation: NavigationHelpers<any, any>
  refetch():void
}

export function UserCard({user, navigation,refetch}:IProps) {
  const [visible, setVisible] = useState(false);
  const roleString = CapitalizeFirstLetter(user.role.toLowerCase())
  const [avatarColor] = useState(randomColor({luminosity: 'dark'}))

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <Fragment>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{width: '80%'}}>
        <Text style={{fontWeight: 'bold',textAlign:'center', fontSize: 18}}>{user.name}'s Options</Text>
        <View style={{marginTop: 12}}>
          {
            user.role === 'TEACHER' && <Fragment>
              <Button
                title={`View Attendance`}
                containerStyle={{marginBottom: 8}}
                onPress={()=>navigation.navigate('User', {user})}
                icon={<Icon name="settings" size={24} color="white"/>}
                buttonStyle={{paddingVertical: 16}}
              />
            </Fragment>
          }
          
          <Button
            title={`Update ${roleString}`}
            containerStyle={{marginBottom: 8}}
            onPress={()=>navigation.navigate('Update', {user})}
            icon={<Icon name="settings" size={24} color="white"/>}
            buttonStyle={{paddingVertical: 16}}
          />
          <Button
            title={`Delete ${roleString}`}
            onPress={async ()=>{
              axios.delete(`${API_URI}/${user.role}s/${user.id}`, {
                headers: {
                  'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
                }
              }).then((res)=>{
                ToastAndroid.show(`Succcessfully deleted ${user.role.toLowerCase()} ${user.name}.`, ToastAndroid.LONG);
                setVisible(false);
                refetch();
              })
            }}
            icon={<Icon name="delete" size={24} color="white"/>}
            buttonStyle={{backgroundColor:'red', paddingVertical: 16}}
          />
        </View>
        
      </Overlay>
      <Card containerStyle={{borderRadius: 8, minHeight: 82}}>
        <View style={{flex: 1, flexDirection:'row'}}>
          <Avatar 
            rounded
            title={AvatarText(user.name)}
            size='medium'
            overlayContainerStyle={{backgroundColor: avatarColor}}
            containerStyle={{marginRight: 8}}
          />
          <View style={{justifyContent:'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>{user.name}</Text>
            <Text style={{color: '#555'}}>{user.email}</Text>
          </View>
          <View style={{flex: 1, justifyContent:'center' ,alignItems:'flex-end'}}>
            <Button
              icon={ <Icon name="list" size={24} color="white"/>}
              onPress={toggleOverlay}
            />
          </View>
        </View>
      </Card>
    </Fragment>
  )
}