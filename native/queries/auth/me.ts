import { Token, UserResponse } from "../../types";
import {API_URI, ENV} from '@env'
import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* `{{base}}/auth/check` with token authentication */
export async function getMe() {
  const asToken=await AsyncStorage.getItem('token')
  // if (token.length === 0) return null
  if (asToken === null) return null

  try {
    const get = await axios.get(API_URI+'/auth/check', {
      headers: {
        'Authorization': `Bearer ${asToken}`
      }
    }) as AxiosResponse<UserResponse>
    return get
  } catch (err) {
    // Clear storage if invalid auth
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('user')
  }
}