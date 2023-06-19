import { AxiosError } from "axios";
import { Constants } from "../constants.enum";

interface IHttpErrorResponseData {
  statusCode: number;
  message: string;
}

function ErrorInterceptor(error: AxiosError<IHttpErrorResponseData>) {
  const { response } = error;

  if (response?.data.statusCode === 401) {
    localStorage.removeItem(Constants.LOCAL_STORAGE_TOKEN);
    localStorage.removeItem(Constants.LOCAL_STORAGE_USERNAME);


    return Promise.reject(
      new Error(
        void window.location.replace(
          `/login?redirectPath=${window.location.pathname}`
        )
      )
    );
  }

  return Promise.reject(new Error(response?.data.message));
}

export default ErrorInterceptor;
