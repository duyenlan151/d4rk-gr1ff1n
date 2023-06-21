import axios, { AxiosResponse } from "axios";
import { Observable } from "rxjs";

import JWTInterceptor from "../interceptors/jwt.interceptor";
import ErrorInterceptor from "../interceptors/error.interceptor";

axios.interceptors.request.use(JWTInterceptor);
axios.interceptors.response.use(undefined, ErrorInterceptor);

export interface IResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

interface IHttpGetOptions {
  params: Record<string, string>
}

interface IHttpProvider {
  post<T = any>(url: string, body: Record<string, any>): Observable<IResponse<T>>;
  get<T = any>(url: string, options?: IHttpGetOptions): Observable<IResponse<T>>;
  patch<T = any>(url: string, body: Record<string, any>): Observable<IResponse<T>>;
}

function useHttpProvider(): IHttpProvider {
  /**
   * 
   * @param url 
   * @param body 
   * @returns 
   */
  function post<T>(url: string, body: Record<string, any>): Observable<IResponse<T>> {
    return _fromRequestPromise(axios.post(url, body));
  }

  /**
   * 
   * @param url 
   * @param options 
   */
  function get<T>(url: string, options?: IHttpGetOptions): Observable<IResponse<T>> {
    return _fromRequestPromise(axios.get(url, { params: options?.params }));
  }

  /**
   * 
   * @param url 
   * @param body 
   */
  function patch<T>(url: string, body: Record<string, any>): Observable<IResponse<T>> {
    return _fromRequestPromise(axios.patch(url, body));
  }

  /**
   * 
   * @param request 
   * @returns 
   */
  function _fromRequestPromise<T>(request: Promise<AxiosResponse<IResponse<T>>>): Observable<IResponse<T>> {
    return new Observable<IResponse<T>>((subscriber) => {
      request
        .then((value) => {
          subscriber.next(value.data);
          subscriber.complete();
        })
        .catch((err) => subscriber.error(err));
    });
  }

  return { post, get, patch };
}

export default useHttpProvider;
