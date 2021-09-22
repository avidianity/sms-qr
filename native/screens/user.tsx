import React, {ComponentType, Fragment, useEffect, useState} from 'react';
import { Avatar, Button, Divider, Overlay, Text } from 'react-native-elements';
import {RefreshControl, View} from 'react-native';
import { Calendar, CustomMarking, DateObject } from 'react-native-calendars';
import { User } from '../types';
import { Splash } from '.';
import { useQuery } from 'react-query';
import { getAttendance } from '../queries/teachers/attendances';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from 'react-native-elements'
import { AvatarText, CapitalizeFirstLetter } from '../utils/string';
import randomColor from 'randomcolor';
import { TrueUserCard } from '../components/UserCard';
import { Attendance } from './scan';

type tmp = {
  [date: string]: CustomMarking;
}

interface DateAttendance extends DateObject {
  attendance: Attendance
}

export function UserScreen(props:NativeStackScreenProps<RootStackParamList, 'User'>) {
  const user = props.route?.params?.user

  const {data, isLoading, refetch} = useQuery(['attendance', user?.id], async () => await getAttendance(user))
  const [dates, setDates] = useState<tmp>({})
  const [openDate, setOpenDate] = useState<DateAttendance>()

  const handleDayPress = (date:DateObject) => {
    if (dates[date.dateString]) {
      const attendance = data?.data.find(data => (data.createdAt.startsWith(date.dateString)) ? data : null)
      if (attendance) setOpenDate({...date, attendance})
    }
  }
  
  useEffect(()=> {
    setDates(()=> {

      let tmp:tmp = {};
      data?.data.forEach(res=>{
        tmp[res.createdAt.substr(0, 10)] = {
          customStyles: {
            container: {
              backgroundColor: '#228B22',
            },
            text: {
              color: 'white',
              fontWeight: 'bold'
            }
          }
        }
      })
      return tmp
    })
  }, [data])

  return (
    <Fragment>
      <Overlay isVisible={!!(openDate)} onBackdropPress={()=>setOpenDate(undefined)}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Attendance on {openDate?.dateString}</Text>
        <Divider style={{marginVertical: 16}}/>
        <Text><Text style={{fontWeight:'bold'}}>Time of Creation:</Text> {openDate?.attendance.createdAt && new Date(openDate?.attendance.createdAt).toTimeString()}</Text>
        <Text><Text style={{fontWeight:'bold'}}>Time of Update:</Text> {openDate?.attendance.updatedAt && new Date(openDate?.attendance.updatedAt).toTimeString()}</Text>
        <View style={{alignItems: 'flex-end', paddingTop: 16}}>
          <Button
            title='Close'
            onPress={()=>setOpenDate(undefined)}
          />
        </View>
      </Overlay>
      <View style={{flex: 1}}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={()=>refetch()}
            />
          }
        >
          <TrueUserCard user={user} />
          <Text style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginVertical: 12}}>Attendance Calendar</Text>
          <Calendar
            markingType='custom'
            markedDates={dates}
            onDayPress={handleDayPress}
          />
        </ScrollView>
      </View>
    </Fragment>
  )
}