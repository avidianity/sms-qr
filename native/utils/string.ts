import Constants from "expo-constants";

export function CapitalizeFirstLetter(str: string | undefined) {
  if (!str) return "Unknown";

  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function AvatarText(str: string | undefined) {
  if (!str) return "?";
  const split = str.toUpperCase().split(/\s/);
  var ret = split[0][0];
  if (split[1]) ret = ret + split[1][0];
  return ret;
}

export const SERVER_API: String =
  Constants.manifest?.extra!.SERVER_API.toString();

export const ENVIRONMENT: String =
  Constants.manifest?.extra!.ENVIRONMENT.toString();
