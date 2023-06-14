/* eslint-disable react-hooks/exhaustive-deps */
import { Button, FormControl, FormGroup, FormHelperText, InputLabel, OutlinedInput, SxProps, Theme } from "@mui/material";
import { Dispatch, FormEvent, FormEventHandler, SetStateAction, useEffect, useState } from "react"; 
import { Observable, Subject, debounceTime, map, of, switchMap, takeUntil, tap } from "rxjs";

import PasswordTextField from "../../../../shared/components/password-textfield/password-textfield.component";
import useAuthProvider, { ISignUpDto, SignUpDto } from "../../auth.provider";

interface IForm {
  onSubmit: (value: SignUpDto) => void;
  errorMessage?: string;
}

function Form({ onSubmit }: IForm) {
  const { checkUser } = useAuthProvider();

  const buttonOverriddenStyles: SxProps<Theme> = { padding: '0', height: '50px', width: '100%', borderRadius: '5px' };
  
  // Form value
  const [formValue, setFormValue] = useState(new SignUpDto());

  // Validation status
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | undefined>(undefined);
  const [isEmailValid, setIsEmailValid] = useState<boolean | undefined>(undefined);

  // Events
  const [formValueChanged$] = useState(new Subject<Record<string, string>>());
  const [usernameInput$] = useState(new Subject<string>());
  const [emailInput$] = useState(new Subject<string>());
  const [passwordInput$] = useState(new Subject<string>());
  const [passwordRetypeInput$] = useState(new Subject<string>());

  function onFormValueChanged(obj: Record<string, string>): void {
    const [[key, value]] = Object.entries(obj);

    setFormValue(formValue.set(key as keyof ISignUpDto, value));
  }

  function onFormSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    onSubmit(formValue);
  }

  useEffect(() => {
    const onDestroy$ = new Subject<void>();

    const usernameValueChanged$ = _validateUserInfo(_debounceInput(usernameInput$), "username");
    const emailValueChanged$ = _validateUserInfo(_debounceInput(emailInput$), "email");

    _registerStore(formValueChanged$, onFormValueChanged);
    _registerStore(usernameValueChanged$, _handleValueChange("username", setIsUsernameValid));
    _registerStore(emailValueChanged$, _handleValueChange("email",setIsEmailValid));

    function _registerStore<T>(store$: Observable<T>, processor: (data: T) => void) {
      store$.pipe(takeUntil(onDestroy$)).subscribe(processor);
    }

    return () => onDestroy$.next();
  }, []);

  function _validateUserInfo(input$: Observable<string>, property: string): Observable<[string, boolean]>{
    let inputValue = "";

    return input$.pipe(
      tap((value) => (inputValue = value)),
      switchMap(_checkUser(property)),
      map((value): [string, boolean] => [inputValue, value])
    );
  }

  function _handleInputChange(eventEmitter$: Subject<string>): FormEventHandler<HTMLInputElement> {
    return (event: FormEvent<HTMLInputElement>) => eventEmitter$.next((event.target as HTMLInputElement).value);
  }

  function _handleValueChange(propName: string, stateSetter: Dispatch<SetStateAction<boolean | undefined>>) {
    return ([value, isNotValid]: [string, boolean]): void => {
      stateSetter(!isNotValid);

      if (isNotValid) {
        return;
      }

      formValueChanged$.next({ [propName]: value });
    };
  }

  function _debounceInput<T>(input$: Observable<T>): Observable<T> {
    return input$.pipe(debounceTime(500));
  }

  function _checkUser(propName: string) {
    return (value: string): Observable<boolean> =>
      !value ? of(false) : checkUser({ [propName]: value });
  }

  return (
    <form className="gap-6 flex flex-col relative" autoComplete="off" onSubmit={onFormSubmit} >
      <FormGroup className="gap-6 flex flex-col">
        <FormControl className="relative" onInput={_handleInputChange(usernameInput$)} error={typeof isUsernameValid === "boolean" && !isUsernameValid}>
          <InputLabel htmlFor="username">Username</InputLabel>
          <OutlinedInput id="username" name="username" label="Username" required/>
          {typeof isUsernameValid === "boolean" && !isUsernameValid && <FormHelperText className="absolute -bottom-5 -left-2" error id="component-error-text">Username already existed.</FormHelperText>}
        </FormControl>
        <FormControl onInput={_handleInputChange(emailInput$)} error={typeof isEmailValid === "boolean" && !isEmailValid}>
          <InputLabel htmlFor="email">Email</InputLabel>
          <OutlinedInput id="email" name="email" label="Email" type="email" required/>
          {typeof isEmailValid === "boolean" && !isEmailValid && <FormHelperText className="absolute -bottom-5 -left-2" error id="component-error-text">Email already existed.</FormHelperText>}
        </FormControl>
        <PasswordTextField id="password" name="password" label="Password" onInput={_handleInputChange(passwordInput$)} />
        <PasswordTextField id="password-retype" name="passwordRetype" label="Retype Password" onInput={_handleInputChange(passwordRetypeInput$)} />
      </FormGroup>
      <Button sx={buttonOverriddenStyles} type="submit" variant="contained">Sign Up</Button>
    </form>
  );
}

export default Form;
