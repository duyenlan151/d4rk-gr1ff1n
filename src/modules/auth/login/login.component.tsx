import { FormEvent, useEffect, useState } from "react";
import { Observable, catchError, of } from "rxjs";
import { useNavigate } from "react-router-dom";

import useAuthProvider, { ILoginDto, LoginDto, LoginResDto } from "../auth.provider";
import Constants from "../../../shared/constants.enum.ts";
import Loader from "../../../shared/components/loader/loader.component";
import Form from "./form/form.component";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthProvider();

  const [rememberCredentials, setRememberCredentials] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  useEffect((): void => {
    const cred = localStorage.getItem(Constants.LOCAL_STORAGE_CREDENTIALS);

    if (cred) {
      _requestLogin(new LoginDto(JSON.parse(cred)));
    }
  });

  function onFormSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    _requestLogin(_getFormValues(event.target as HTMLFormElement));
  }

  function _errorSelector(err: unknown): Observable<LoginResDto> {
    setErrorMessage((err as Error).message);
    setIsProcessing(false);

    return of(new LoginResDto());
  }

  function _onSubmitRespond(params: LoginDto): (LoginResDto: LoginResDto) => void {
    return ({ accessToken }: LoginResDto): void => {
      if (!accessToken) {
        return;
      }

      if (rememberCredentials) {
        localStorage.setItem(Constants.LOCAL_STORAGE_CREDENTIALS, JSON.stringify(params));
      }

      localStorage.setItem(Constants.LOCAL_STORAGE_TOKEN, accessToken);
      navigate("/");
    };
  }

  function _requestLogin(params: LoginDto): void {
    setIsProcessing(true);

    login(params)
      .pipe(catchError(_errorSelector))
      .subscribe(_onSubmitRespond(params));
  }

  function _getFormValues(form: HTMLFormElement): LoginDto {
    const formData = new FormData(form);
    let logInDto = new LoginDto();

    for (const [key, value] of formData) {
      if (key === "isRemember") {
        setRememberCredentials(true);
        continue;
      }

      logInDto = logInDto.set(key as keyof ILoginDto, value as string);
    }

    return logInDto;
  }

  return (
    <div className="w-screen h-screen flex p-36 justify-between">
      <p>login works</p>
      <div className="flex flex-col gap-20 p-16 border border-black rounded-lg w-4/12 relative">
        {isProcessing && <Loader />}
        <div>
          <h1 className="text-3xl font-semibold">Login</h1>
          <p>Welcome back</p>
        </div>
        <Form onSubmit={onFormSubmit} errorMessage={errorMessage} />
      </div>
    </div>
  );
}

export default Login;
