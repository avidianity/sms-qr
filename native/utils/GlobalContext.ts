import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createContext, useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { RootStackParamList } from "../App";
import { getMe } from "../queries/auth/me";
import { Token, User } from "../types";
import { Restart } from "fiction-expo-restart";

// export type GlobalContent = {
//   token: Token | 'none'
//   setToken: React.Dispatch<React.SetStateAction<string>>
// }

// export const GlobalContext = createContext<GlobalContent>({
//   token: 'none',
//   setToken: () => {}
// })

export const useAuth = (
  props?: NativeStackScreenProps<RootStackParamList, any>
) => {
  const query = useQuery("check", async () => await getMe());

  useEffect(() => {
    if (query.data?.data.token)
      AsyncStorage.setItem("token", query.data?.data.token).then();
  }, [query.data]);

  const setToken = async (token: Token) => {
    await AsyncStorage.setItem("token", token);
    query.refetch();
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    query.refetch().then(() => {
      // props?.navigation.reset({index: 0, routes: [{name: 'Welcome', params: {method: 'logout'}}]})
      props?.navigation.replace("Welcome", { method: "logout" });
    });
  };

  return { ...query, logout, setToken };
};

export const useUserQuery = (token: Token) => {
  const query = useQuery(
    "user",
    async () => await getMe().then((res) => res?.data.user)
  );

  useEffect(() => {
    query.refetch();
  }, [token]);

  return query;
};
