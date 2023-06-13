import "./login.component.scss";

import { FormEvent, useEffect, useState } from "react";
import { Observable, catchError, of } from "rxjs";
import { useNavigate } from "react-router-dom";

import useAuthProvider, { ILoginDto, LoginDto, LoginResDto } from "../auth.provider";
import backgroundSmall from "../../../assets/images/login-background-small.jpg";
import Constants from "../../../shared/constants.enum.ts";
import background from "../../../assets/images/login-background.jpg";
import Loader from "../../../shared/components/loader/loader.component";
import Form from "./form/form.component";
import Logo from "../../../shared/components/logo/logo.component.tsx";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthProvider();

  // UI related
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form related
  const [rememberCredentials, setRememberCredentials] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  useEffect((): void => {
    const cred = localStorage.getItem(Constants.LOCAL_STORAGE_CREDENTIALS);

    if (cred) {
      _requestLogin(new LoginDto(JSON.parse(cred)));
    }
  });

  function onBackgroundLoaded(): void {
    setBackgroundLoaded(true)
  }

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
        <div id="image-container" className="w-full h-full relative bg-no-repeat bg-center bg-cover" style={{ backgroundImage: `url(${backgroundSmall})` }}>
          <img src={background} alt="background-image" className="w-full h-full transition-opacity duration-300 ease-in" style={{ opacity: backgroundLoaded ? 1 : 0 }} onLoad={onBackgroundLoaded}/>
        </div>
      </div>
      <div id="content" className="w-full h-full flex justify-between z-10">
        <div className="branding flex flex-col gap-11 relative">
          <div id="logo-container" className="z-10 text-white relative">
            <Logo className="w-32 h-32" fill="#fff"/>
            <div id="brand">
              <p id="logo" className="text-7xl font-medium uppercase subpixel-antialiased">D4rk Griffin</p>
              <p id="tagline" className="text-2xl font-medium subpixel-antialiased">Let's Create Magic Together - Your Art, Your Way!</p>
            </div>
          </div>
          <div id="description-container" className="z-10 text-white relative">
            <p id="description" className="text-lg">At my personal anime artist commission page, my mission is to weave dreams into reality. I am dedicated to providing a bespoke experience where your imagination takes center stage. Through exceptional artistry and open collaboration, I strive to capture the essence of your anime-inspired visions, creating personalized artworks that bring joy, inspiration, and a touch of magic into your life. With passion, skill, and a commitment to excellence, I aim to exceed your expectations, making each commission a memorable journey filled with creativity, heart, and the power of visual storytelling. Together, let's embark on an artistic adventure that celebrates the beauty, depth, and boundless possibilities of anime art.</p>
          </div>
          <div id="copyright-container" className="z-10 text-white absolute bottom-0 left-0">
            <p>© 2022-2023 Jack Miller. All rights reserved.</p>
          </div>
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
