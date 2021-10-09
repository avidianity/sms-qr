import { Token, User, UserResponse } from "../../types";
import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_API } from "../../utils/string";

/* `{{base}}/auth/check` with token authentication */
export async function getQR(user: Partial<User> | undefined) {
  if (!user) return null;

  try {
    const get = (await axios.get(SERVER_API + "/qr/" + user.id, {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
      },
    })) as AxiosResponse<string>;
    return get;
  } catch (err) {
    // Clear storage if met
    await AsyncStorage.multiRemove(["token, user"]);
  }
}
