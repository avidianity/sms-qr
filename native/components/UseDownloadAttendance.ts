import { API_URI } from "@env";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Linking } from "react-native";
import { RootStackParamList } from "../App";
import { useGlobalContext } from "../utils/GlobalContext";
export function useDownloadAttendance(props:NativeStackScreenProps<RootStackParamList, any> | MaterialTopTabBarProps) {
  const {user} = useGlobalContext(props);

  const DownloadAttendance = async () => {
    Linking.openURL(API_URI+'/attendances/'+user.uuid+'/attendance.xlsx')
  }
  
  return {DownloadAttendance}
}