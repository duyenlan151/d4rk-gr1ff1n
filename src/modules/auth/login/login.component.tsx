import { FormEvent, useState } from "react";
import { firstValueFrom } from "rxjs";

import useAuthProvider from "../auth.provider";
import Form from "./form/form.component";

function Login() {
  const { login } = useAuthProvider();
  const [rememberCredentials, setRememberCredentials] = useState(false);

  function getFormValues(form: HTMLFormElement) {
    const formData = new FormData(form);
    const params: Record<string, any> = {};

    for (const [key, value] of formData) {
      if (key === "isRemember") {
        setRememberCredentials(true);
        continue;
      }

      params[key] = value;
    }

    return params;
  }

  async function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = getFormValues(event.target as HTMLFormElement);
    const { accessToken } = await firstValueFrom(login(params));

    if (rememberCredentials) {
      localStorage.setItem("credentials", JSON.stringify(params));
    }

    localStorage.setItem("accessToken", accessToken);
  }

  return (
    <div className="w-screen h-screen flex p-36 justify-between">
      <p>login works</p>
      <div className="flex flex-col gap-20 p-16 border border-black rounded-lg w-4/12">
        <div>
          <h1 className="text-3xl font-semibold">Login</h1>
          <p>Welcome back</p>
        </div>
        <Form onSubmit={onFormSubmit} />
      </div>
    </div>
  );
}

export default Login;
