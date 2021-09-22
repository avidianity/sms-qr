import React, {ComponentType, useEffect, useState} from 'react';
import { Text } from 'react-native-elements';
import {RefreshControl, View} from 'react-native';
import { Calendar, CustomMarking, DateObject } from 'react-native-calendars';
import { User } from '../types';
import { Splash } from '.';
import { useQuery } from 'react-query';
import { getAttendance } from '../queries/teachers/attendances';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { ScrollView } from 'react-native-gesture-handler';

interface IProps {
  route?: {
    params?: {
      user?: User
    }
  }
}

type tmp = {
  [date: string]: CustomMarking;
}

export function UserScreen(props:NativeStackScreenProps<RootStackParamList, 'User'>) {
  const user = props.route?.params?.user

  const {data, isLoading, refetch} = useQuery(['attendance', user?.id], async () => await getAttendance(user))
  const [dates, setDates] = useState<tmp>({})
  
  const handleDayPress = (date:DateObject) => {
    console.log('pressed day: ' + date.dateString)
  }
  
  useEffect(()=> {
    setDates(()=> {

      let tmp:tmp = {};
      data?.data.forEach(res=>{
        tmp[res.createdAt.substr(0, 10)] = {
          customStyles: {
            container: {
              backgroundColor: 'green'
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
    <View style={{flex: 1}}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={()=>refetch()}
          />
        }
      >
        <Calendar
          markingType='custom'
          markedDates={dates}
          onDayPress={handleDayPress}
        />
      </ScrollView>
    </View>
  )
}