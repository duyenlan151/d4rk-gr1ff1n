import { Observable, map } from "rxjs";
import { environment } from "../../shared/environments/environment";
import { Record } from "immutable";

import useHttpProvider from "../../shared/providers/http.provider";

export interface ILoginDto {
  username: string;
  password: string;
}

export interface ILogInResDto {
  accessToken: string;
}

export class LoginDto extends Record<ILoginDto>({
  username: "",
  password: "",
}) {}

export class LoginResDto extends Record<ILogInResDto>({
  accessToken: "",
}) {}

export interface IAuthProvider {
  login(loginDto: LoginDto): Observable<LoginResDto>;
}

function useAuthProvider(): IAuthProvider {
  const { post } = useHttpProvider();
  const _endpoint = `${environment.remoteServiceURL}/auth`;

  function login(loginDto: LoginDto): Observable<LoginResDto> {
    const url = `${_endpoint}/sign-in`;

    return post<LoginResDto>(url, loginDto).pipe(
      map(({ data }): LoginResDto => new LoginResDto(data))
    );
  }

  return { login };
}

export default useAuthProvider;
