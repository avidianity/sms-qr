import { Token, UserResponse } from "../../types";
import {API_URI, ENV} from '@env'
import axios, { AxiosResponse } from "axios";

// base/auth/check with token bearer
export async function getMe(token:Token) {
  if (token.length === 0) return undefined
  
  const get = await axios.get(API_URI+'/auth/check', {
    headers: {
      'Authorization': token
    }
  }) as AxiosResponse<UserResponse>
 
  return get
}