import { Observable, map } from "rxjs";
import { environment } from "../../shared/environments/environment";
import { Record as ImmutableRecord } from "immutable";

import useHttpProvider from "../../shared/providers/http.provider";

export interface ILoginDto {
  username: string;
  password: string;
}

export interface ILogInResDto {
  accessToken: string;
}

export interface ISignUpDto {
  username?: string;
  email?: string;
  password?: string;
}

export interface ISignUpFormDto extends ISignUpDto {
  passwordRetype?: string;
}

export class LoginDto extends ImmutableRecord<ILoginDto>({
  username: "",
  password: "",
}) {}

export class LoginResDto extends ImmutableRecord<ILogInResDto>({
  accessToken: "",
}) {}

export class SignUpDto extends ImmutableRecord<ISignUpDto>({
  username: undefined,
  email: undefined,
  password: undefined,
}) {}

export class SignUpFormDto extends ImmutableRecord<ISignUpFormDto>({
  username: undefined,
  email: undefined,
  password: undefined,
  passwordRetype: undefined,
}) {}

export interface IAuthProvider {
  login(loginDto: LoginDto): Observable<LoginResDto>;
  checkUser(user: Record<string, string>): Observable<boolean>;
  signUp(signUpDto: SignUpDto): Observable<LoginResDto>;
}

function useAuthProvider(): IAuthProvider {
  const { post, get } = useHttpProvider();
  const _endpoint = `${environment.remoteServiceURL}/auth`;

  function login(loginDto: LoginDto): Observable<LoginResDto> {
    const url = `${_endpoint}/sign-in`;

    return post<LoginResDto>(url, loginDto).pipe(
      map(({ data }): LoginResDto => new LoginResDto(data))
    );
  }

  function signUp(signUpDto: SignUpDto): Observable<LoginResDto> {
    const url = `${_endpoint}/sign-up`;

    return post<LoginResDto>(url, signUpDto).pipe(
      map(({ data }): LoginResDto => new LoginResDto(data))
    );
  }

  function checkUser(user: Record<string, string>): Observable<boolean> {
    const url = `${_endpoint}/exist`;

    return get<boolean>(url, { params: user }).pipe(map(({ data }) => !data));
  }

  return { login, signUp, checkUser };
}

export default useAuthProvider;
