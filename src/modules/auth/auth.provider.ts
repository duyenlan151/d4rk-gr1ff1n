import { environment } from "../../shared/environments/environment";
import { map } from "rxjs";

import useHttpProvider from "../../shared/providers/http.provider";

interface ILoginDto {
  username?: string;
  password?: string;
}

class LoginDto implements ILoginDto {
  username?: string | undefined;
  password?: string | undefined;

  constructor(params: ILoginDto) {
    this.username = params.username;
    this.password = params.password;
  }
}

function useAuthProvider() {
  const { post } = useHttpProvider();
  const _endpoint = `${environment.remoteServiceURL}/auth`;

  function login(loginDto: LoginDto) {
    const url = `${_endpoint}/sign-in`;

    return post<{ accessToken: string }>(url, loginDto).pipe(
      map(({ data }) => data)
    );
  }

  return { login };
}

export default useAuthProvider;
