import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createContext, useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { RootStackParamList } from "../App";
import { getMe } from "../queries/auth/me";
import { Token, User } from "../types";

export type GlobalContent = {
  user: Partial<User>
  setUser: React.Dispatch<React.SetStateAction<Partial<User>>>
  token: Token
  setToken: React.Dispatch<React.SetStateAction<string>>
}

export const GlobalContext = createContext<GlobalContent>({
  user: {},
  setUser: () => {},
  token: '',
  setToken: () => {}
})

export const useGlobalContext = (props:NativeStackScreenProps<RootStackParamList, any> | MaterialTopTabBarProps) => {
  const context = useContext(GlobalContext);

  useEffect(()=> {
    if (props.navigation.getState().index === 0) return

    if (context.token === '' || context.user === {}) {
      console.log(context.token, context.user)

      props.navigation.reset({index: 0, routes: [{ name: 'Welcome'}]})
    }
  }, [context])

  return context
}