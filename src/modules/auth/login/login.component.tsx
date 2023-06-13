import "./login.component.scss";

import { FormEvent, useEffect, useState } from "react";
import { Observable, catchError, of } from "rxjs";
import { useNavigate } from "react-router-dom";

import useAuthProvider, { ILoginDto, LoginDto, LoginResDto } from "../auth.provider";
import Constants from "../../../shared/constants.enum.ts";
import background from "../../../assets/images/login-background.jpg";
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
    <div className="w-screen h-screen p-36 relative">
      <div id="background" className="absolute w-full h-full top-0 left-0 z-0 pointer-events-none">
        <div id="image-container" className="w-full h-full relative">
          <img src={background} alt="background-image" className="w-full h-full"/>
        </div>
      </div>
      <div id="content" className="w-full h-full flex justify-between z-10">
        <div className="z-10">
          <p>login works</p>
        </div>
        <div className="flex flex-col gap-20 p-16 shadow-lg shadow-gray-500/60 rounded-lg w-4/12 relative bg-white">
          {isProcessing && <Loader />}
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-semibold">Login</h1>
            <p>Welcome back, please enter your credentials below to access your account and continue your creative journey.</p>
          </div>
          <Form onSubmit={onFormSubmit} errorMessage={errorMessage} />
        </div>
      </div>
    </div>
  );
}

export default Login;
