import { API_URI } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios, { AxiosResponse } from "axios"
import { User } from "../../types"

export async function getTeachers(token:string) {
  if (token.length === 0) return null

  try {
    const get = await axios.get(API_URI+'/teachers/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }) as AxiosResponse<User[]>
    return get
  } catch (err) {
    // Clear storage if invalid auth
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('user')
  }
}