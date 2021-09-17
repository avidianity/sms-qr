import { createContext, useContext } from "react";
import { Token, User } from "../types";

export type GlobalContent = {
  user: Partial<User>
  setUser(user:Partial<User>): void
  token: Token
  setToken(user:Token): void
}

export const GlobalContext = createContext<GlobalContent>({
  user: {},
  setUser: () => {},
  token: '',
  setToken: () => {}
})

export const useGlobalContext = () => useContext(GlobalContext)