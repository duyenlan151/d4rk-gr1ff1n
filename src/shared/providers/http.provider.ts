import { from, map } from "rxjs";
import axios from "axios";

export type Response<T> = {
  statusCode: number;
  data: T;
  message: string;
}

function useHttpProvider() {
  function post<T>(url: string, body: Record<string, any>) {
    return from(axios.post(url, body)).pipe(map(({ data }): Response<T> => data));
  }

  function get(url: string, options?: { params: Record<string, string> }) {}

  function patch(url: string, body: Record<string, any>) {}

  return { post, get, patch };
}

export default useHttpProvider;
