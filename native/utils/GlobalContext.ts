import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext } from "react";
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

export const useGlobalContext = () => useContext(GlobalContext)