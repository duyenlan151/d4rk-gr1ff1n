import "./login.component.scss";

import { User, useUserContext, useUserProvider } from "../../../shared/providers/user.provider.ts";
import { Observable, catchError, forkJoin, of } from "rxjs";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FormEvent, useEffect } from "react";
import { useToastContext } from "../../../shared/providers/toast.provider.ts";
import { Constants } from "../../../shared/constants.enum.ts";
import { useSignal } from "@preact/signals-react";


import useAuthProvider, { ILoginDto, LoginDto, LoginResDto } from "../auth.provider";
import backgroundSmall from "../../../assets/images/login-background-small.jpg";
import background from "../../../assets/images/login-background.jpg";
import Background from "../../../shared/components/background/background.component.tsx";
import Loader from "../../../shared/components/loader/loader.component";
import Form from "./form/form.component";
import Logo from "../../../shared/components/logo/logo.component.tsx";

function Login() {
  const navigate = useNavigate();
  
  const [searchParams] = useSearchParams();
  
  const { getPermissionList, getRoleList } = useUserProvider();
  const { user } = useUserContext();
  const { showToast } = useToastContext()
  const { login } = useAuthProvider();

  // UI related
  const isProcessing = useSignal(false)

  // Form related
  const rememberCredentials = useSignal(false);
  const errorMessage = useSignal<string | undefined>(undefined);

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
    errorMessage.value = (err as Error).message
    isProcessing.value = false;

    return of(new LoginResDto());
  }

  function _onSubmitRespond({ username }: LoginDto): (LoginResDto: LoginResDto) => void {
    return ({ accessToken }: LoginResDto): void => {
      if (!accessToken) {
        return;
      }

      localStorage.setItem(Constants.LOCAL_STORAGE_TOKEN, accessToken);
      localStorage.setItem(Constants.LOCAL_STORAGE_USERNAME, username as string);

      forkJoin([getPermissionList(), getRoleList()]).subscribe(
        ([permissions, roles]) => {
          showToast("Logged in successfully.")

          user.value = new User({ permissions, roles, username });
          navigate(searchParams.has(Constants.ROUTER_SNAPSHOT_PARAM_REDIRECT) ? (searchParams.get(Constants.ROUTER_SNAPSHOT_PARAM_REDIRECT) as string) : "/");
        }
      );
    };
  }

  function _requestLogin(params: LoginDto): void {
    isProcessing.value = true;

    login(params)
      .pipe(catchError(_errorSelector))
      .subscribe(_onSubmitRespond(params));
  }

  function _getFormValues(form: HTMLFormElement): LoginDto {
    const formData = new FormData(form);
    let logInDto = new LoginDto();

    for (const [key, value] of formData) {
      if (key === "isRemember") {
        rememberCredentials.value = true;
        continue;
      }

      logInDto = logInDto.set(key as keyof ILoginDto, value as string);
    }

    return logInDto;
  }

  return (
    <div className="w-screen h-screen p-36 relative">
      <Background background={background} backgroundSmall={backgroundSmall}/>
      <div id="content" className="w-full h-full flex justify-between z-10">
        <div className="branding flex flex-col gap-11 relative">
          <div id="logo-container" className="z-10 text-white relative">
              <div className="cursor-pointer w-min">
                <Link to="/">
                    <Logo className="w-32 h-32" fill="#fff"/>
                </Link>
              </div>
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
        <div className="flex flex-col gap-20 p-16 shadow-lg shadow-stone-950/60 rounded-lg w-4/12 relative bg-white">
          <Loader isVisible={isProcessing}/>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-semibold">Login</h1>
            <p>Welcome back, please enter your credentials below to access your account and continue your creative journey.</p>
          </div>
          <Form onSubmit={onFormSubmit} errorMessage={errorMessage.value} />
        </div>
      </div>
    </div>
  );
}

export default Login;
