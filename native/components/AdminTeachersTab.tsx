import React from 'react'
import { Pressable, RefreshControl, ScrollView, View } from 'react-native'
import { Text } from 'react-native-elements'
import { Card } from 'react-native-elements/dist/card/Card'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { useQuery } from 'react-query'
import { getTeachers } from '../queries/teachers'
import { useGlobalContext } from '../utils/GlobalContext'
import { UserCard } from './UserCard'

interface IProps {
  navigation : any
}

export function AdminTeachersTab({navigation}:IProps) {
  const { token } = useGlobalContext()

  const { data,isLoading,refetch } = useQuery('teachers', async ()=> getTeachers(token), {
    refetchOnWindowFocus: true
  })

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
        {
          data?.data.map((user, key)=><UserCard user={user} key={key} navigation={navigation}/>)
        }
        <View style={{borderRadius: 8, height: 92}}>
          <Pressable
            onPress={()=>navigation.navigate('Update', {method: 'add_teacher'})}
            android_ripple={{color: '#18a86b', radius: 8}}
            style={{flex: 1, borderRadius: 8, backgroundColor: '#f373353', alignItems: 'center', justifyContent: 'center'}}
          >
            <Icon
              name='add'
              iconStyle={{color:'#f37335', fontSize: 32}}
            />
              <Text style={{color:'#f37335'}}>Add Teacher</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}