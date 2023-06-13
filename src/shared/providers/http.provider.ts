import { Observable, catchError, from, map, throwError } from "rxjs";
import axios, { AxiosResponse } from "axios";
import JWTInterceptor from "../interceptors/jwt.interceptor";

axios.interceptors.request.use(JWTInterceptor);

export interface IResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

interface IHttpGetOptions {
  params: Record<string, string>
}

interface IHttpProvider {
  post<T>(url: string, body: Record<string, any>): Observable<IResponse<T>>;
  get<T>(url: string, options?: IHttpGetOptions): Observable<IResponse<T>>;
  patch<T>(url: string, body: Record<string, any>): Observable<IResponse<T>>;
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
    return from(request).pipe(
      catchError(({ response }: Record<string, any>) =>
        throwError(() => new Error(response.data.message))
      ),
      map(({ data }: AxiosResponse<IResponse<T>>): IResponse<T> => data)
    );
  }

  return { post, get, patch };
}

export default useHttpProvider;
