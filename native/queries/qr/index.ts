import { UserResponse } from "../../types";
import {API_URI} from '@env'
import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* `{{base}}/auth/check` with token authentication */
export async function getQR(id:number, token: string) {
  if (token.length === 0) return undefined
  
  try {
    const get = await axios.get(API_URI+'/qr/'+id, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }) as AxiosResponse<string>

    return get
  } catch (err) {
    // Clear storage if met
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('user')
  }
}