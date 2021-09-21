import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { RootStackParamList } from "../App";
import { getMe } from "../queries/auth/me";

export function useAuth(props:NativeStackScreenProps<RootStackParamList, any>) {
  const {data:me} = useQuery('me', async ()=>getMe());

  useEffect(()=> {
    if (me === null) props.navigation.reset({index: 0, routes: [{ name: 'Welcome'}]})
  }, [me])
  
  return {me}
}