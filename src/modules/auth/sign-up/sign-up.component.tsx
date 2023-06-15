import "./sign-up.component.scss";

import { Observable, catchError, firstValueFrom, of } from "rxjs";
import useAuthProvider, { LoginResDto, SignUpDto } from "../auth.provider";
import { User, useUserContext, useUserProvider } from "../../../shared/providers/user.provider";
import { useNavigate } from "react-router-dom";
import { Constants } from "../../../shared/constants.enum";
import { useSignal } from "@preact/signals-react";
import { Link } from "react-router-dom";

import Form from "./form/form.component";
import background from "../../../assets/images/sign-up-background.jpg";
import backgroundSmall from "../../../assets/images/sign-up-background-small.jpg";
import Background from "../../../shared/components/background/background.component";
import Loader from "../../../shared/components/loader/loader.component";
import Logo from "../../../shared/components/logo/logo.component";


function SignUp() {
  const navigate = useNavigate();

  const { getPermissionList } = useUserProvider();
  const { signUp } = useAuthProvider();  
  const { user } = useUserContext();

  const isProcessing = useSignal(false);
  const errorMessage = useSignal<string | undefined>(undefined)

  function onFormSubmit(value: SignUpDto): void {
    isProcessing.value = true;

    signUp(value).pipe(catchError(_errorSelector)).subscribe(_onSubmitRespond(value));
  }

  function _onSubmitRespond ({ username }: SignUpDto)  {
   return async ({ accessToken }: LoginResDto) => {
     if (!accessToken) {
       return;
     }

     localStorage.setItem(Constants.LOCAL_STORAGE_TOKEN, accessToken);
     localStorage.setItem(Constants.LOCAL_STORAGE_USERNAME, username as string);

     user.value = new User({ username, permissions: await firstValueFrom(getPermissionList()) });
     navigate("/");
   };
  }

  function _errorSelector(err: unknown): Observable<LoginResDto> {
    errorMessage.value = (err as Error).message;
    isProcessing.value = false;

    return of(new LoginResDto());
  }

  return (
    <div className="w-screen h-screen p-36 relative">
      <Background background={background} backgroundSmall={backgroundSmall}/>
      <div id="content" className="w-full h-full flex justify-between z-10">
        <div className="flex flex-col justify-between p-16 shadow-lg shadow-stone-950/60 rounded-lg w-4/12 relative bg-white">
          {isProcessing.value && <Loader />}
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-semibold">Hi, Friend!</h1>
            <p>Unlock Your Creative Journey with Us!</p>
          </div>
          <Form onSubmit={onFormSubmit} errorMessage={errorMessage.value} />
          <div className="w-full flex justify-center">
            <p>Already got an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
        <div className="branding flex flex-col gap-11 relative">
          <div id="logo-container" className="z-10 text-white relative">
            <div className="cursor-pointer w-min">
              <Link to="/">
                  <Logo className="w-32 h-32" fill="#fff"/>
              </Link>
            </div>
            <div id="brand">
              <p id="logo" className="text-7xl font-medium uppercase subpixel-antialiased">D4rk Griffin</p>
              <p id="tagline" className="text-2xl font-medium subpixel-antialiased">Art Made Just for You – Commission Your Perfect Piece!</p>
            </div>
          </div>
          <div id="description-container" className="z-10 text-white relative text-lg flex flex-col gap-2">
            <p className="description">Welcome to D4RK GRIFFIN, where your artistic dreams find their ultimate expression. As the sole artist behind this site, I am dedicated to turning your imagination into awe-inspiring works of art.</p>
            <p className="description">From mesmerizing portraits to captivating scenes, my artistry is driven by a desire to evoke emotions and ignite your imagination. Every brushstroke infused with the essence of your dreams.</p>
            <p className="description">Through open communication and a transparent process, I invite you to actively participate in the creation of your artwork. Experience the thrill of witnessing your dreams manifest on canvas or screen.</p>
            <p className="description">Elevate your space, evoke emotions, and embrace the power of art tailor-made for you. At D4RK GRIFFIN, I am here to make your artistic dreams a reality.</p>
            <p className="description text-right italic">Unleash your imagination and witness your dreams transformed.</p>
          </div>
          <div id="copyright-container" className="z-10 text-white absolute bottom-0 right-0">
            <p>© 2022-2023 Jack Miller. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
