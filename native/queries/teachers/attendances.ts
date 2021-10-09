import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { Attendance } from "../../screens/scan";
import { User } from "../../types";
import { SERVER_API } from "../../utils/string";

export async function getAttendance(user: Partial<User> | undefined) {
  if (user === undefined) return null;

  const asToken = await AsyncStorage.getItem("token");
  // if (token.length === 0) return null
  if (asToken === null) return null;

  try {
    const get = (await axios.get(
      SERVER_API + "/teachers/" + user.id + "/attendances",
      {
        headers: {
          Authorization: `Bearer ${asToken}`,
        },
      }
    )) as AxiosResponse<Attendance[]>;
    return get;
  } catch (err) {
    // Clear storage if invalid auth
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  }
}
