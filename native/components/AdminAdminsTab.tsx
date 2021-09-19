import React from 'react'
import { Pressable, RefreshControl, ScrollView, View } from 'react-native'
import { Text } from 'react-native-elements'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { useQuery } from 'react-query'
import { getAdmins } from '../queries/admins'
import { useGlobalContext } from '../utils/GlobalContext'
import { UserCard } from './UserCard'

interface IProps {
  navigation : any
}

export function AdminAdminsTab({navigation}:IProps) {
  const { token } = useGlobalContext()

  const { data,isLoading,refetch } = useQuery('admins', async ()=> getAdmins(token), {
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
            onPress={()=>navigation.navigate('Update', {method: 'add_admin'})}
            android_ripple={{color: '#18a86b', radius: 8}}
            style={{flex: 1, borderRadius: 8, backgroundColor: '#f373353', alignItems: 'center', justifyContent: 'center'}}
          >
            <Icon
              name='add'
              iconStyle={{color:'#f37335', fontSize: 32}}
            />
              <Text style={{color:'#f37335'}}>Add Admin</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}