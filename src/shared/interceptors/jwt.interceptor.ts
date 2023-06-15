import { InternalAxiosRequestConfig } from "axios";
import { Constants } from "../constants.enum";

function JWTInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const accessToken = localStorage.getItem(Constants.LOCAL_STORAGE_TOKEN);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
}

export default JWTInterceptor;
