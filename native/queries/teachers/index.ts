import { API_URI } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { User } from "../../types";

export async function getTeachers() {
  try {
    const get = (await axios.get(API_URI + "/teachers/", {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
      },
    })) as AxiosResponse<User[]>;
    return get;
  } catch (err) {
    // Clear storage if invalid auth
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  }
}
