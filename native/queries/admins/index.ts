import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { User } from "../../types";
import { SERVER_API } from "../../utils/string";

export async function getAdmins() {
  try {
    const get = (await axios.get(SERVER_API + "/admins/", {
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
