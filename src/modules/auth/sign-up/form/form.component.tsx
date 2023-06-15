/* eslint-disable react-hooks/exhaustive-deps */
import { Button, FormControl, FormGroup, FormHelperText, InputLabel, OutlinedInput, SxProps, Theme } from "@mui/material";
import { ClipboardEvent, Dispatch, FormEvent, FormEventHandler, SetStateAction, useEffect, useState } from "react"; 
import { Observable, Subject, debounceTime, forkJoin, iif, map, of, switchMap, takeUntil, tap } from "rxjs";
import { List } from "immutable";

import PasswordTextField from "../../../../shared/components/password-textfield/password-textfield.component";
import useAuthProvider, { ISignUpFormDto, SignUpDto, SignUpFormDto } from "../../auth.provider";

interface IForm {
  onSubmit: (value: SignUpDto) => void;
  errorMessage?: string;
}

type ValidatorFn<T = unknown> = (value: T, mutativeErrorList: string[]) => Observable<boolean | undefined>;

enum SignUpControl {
  USERNAME = "username",
  EMAIL = "email",
  PASSWORD = "password",
  PASSWORD_RETYPE = "passwordRetype"
}

function Form({ onSubmit }: IForm) {
  const { checkUser } = useAuthProvider();

  const buttonOverriddenStyles: SxProps<Theme> = { padding: '0', height: '50px', width: '100%', borderRadius: '5px' };
  const initErrorList = List<string>();
  
  // Form value
  const [formValue, setFormValue] = useState(new SignUpFormDto());

  // Validation status
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | undefined>(undefined);
  const [isEmailValid, setIsEmailValid] = useState<boolean | undefined>(undefined);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | undefined>(undefined);
  const [isPasswordRetypeValid, setPasswordRetypeValid] = useState<boolean | undefined>(undefined);

  // Validation Errors
  const [userNameErrors, setUsernameErrors] = useState<List<string>>(initErrorList);
  const [emailErrors, setEmailErrors] = useState<List<string>>(initErrorList);
  const [passwordErrors, setPasswordErrors] = useState<List<string>>(initErrorList);
  const [passwordRetypeErrors, setPasswordRetypeErrors] = useState<List<string>>(initErrorList);

  // Form event
  const [formValueChanged$] = useState(new Subject<Record<string, string>>());

  // Form Control events
  const [usernameInput$] = useState(new Subject<string>());
  const [emailInput$] = useState(new Subject<string>());
  const [passwordInput$] = useState(new Subject<string>());
  const [passwordRetypeInput$] = useState(new Subject<string>());

  // ==========================================
  // Event Handlers
  // ==========================================
  function onInputControlCopyOrPaste(event: ClipboardEvent<HTMLInputElement>): void {
    event.preventDefault();
  }

  function onFormValueChanged(obj: Record<string, string>): void {
    const [[key, value]] = Object.entries(obj);

    if (key === SignUpControl.PASSWORD && formValue.passwordRetype) {
      const validRetype = formValue.passwordRetype === value

      if (!validRetype) {
        setPasswordRetypeErrors(List(["Does not match with password!"]));
      }

      setPasswordRetypeValid(validRetype);
    }

    setFormValue(formValue.set(key as keyof ISignUpFormDto, value));
  }

  function onFormSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!(isUsernameValid && isEmailValid && isPasswordValid && isPasswordRetypeValid)) {
      return;
    }

    onSubmit(new SignUpDto(formValue));
  }
  // ==========================================
  // Event Handlers
  // ==========================================

  useEffect(() => {
    const onDestroy$ = new Subject<void>();

    const usernameValueChanged$ = _validateInputValue(_debounceInput(usernameInput$), [_checkUser(SignUpControl.USERNAME)], setUsernameErrors);
    const emailValueChanged$ = _validateInputValue(_debounceInput(emailInput$), [_checkEmailFormat, _checkUser(SignUpControl.EMAIL)], setEmailErrors);
    const passwordValueChanged$ = _validateInputValue(_debounceInput(passwordInput$), [_checkPassword], setPasswordErrors);
    const passwordRetypeValueChanged$ = _validateInputValue(_debounceInput(passwordRetypeInput$), [_checkPasswordRetype], setPasswordRetypeErrors);

    _registerStore(formValueChanged$, onFormValueChanged);
    _registerStore(usernameValueChanged$, _handleValueChange(SignUpControl.USERNAME, setIsUsernameValid));
    _registerStore(emailValueChanged$, _handleValueChange(SignUpControl.EMAIL,setIsEmailValid));
    _registerStore(passwordValueChanged$, _handleValueChange(SignUpControl.PASSWORD,setIsPasswordValid));
    _registerStore(passwordRetypeValueChanged$, _handleValueChange(SignUpControl.PASSWORD_RETYPE, setPasswordRetypeValid));

    function _registerStore<T>(store$: Observable<T>, processor: (data: T) => void) {
      store$.pipe(takeUntil(onDestroy$)).subscribe(processor);
    }

    return () => onDestroy$.next();
  }, [isUsernameValid, isEmailValid, isPasswordValid, isPasswordRetypeValid, formValue]);

  // ==========================================
  // Helper Functions
  // ==========================================
  function _validateInputValue(input$: Observable<string>, validatorFn: ValidatorFn<string>[], errorSetter: Dispatch<SetStateAction<List<string>>>): Observable<[string, boolean | undefined]> {
    let errorList: string[];
    let inputValue = "";
    
    const composedValidator = (value: string): Observable<boolean> => {
      errorList = [];

      return forkJoin(validatorFn.map((validator: ValidatorFn<string>): Observable<boolean | undefined> => validator(value, errorList))).pipe(
        map((results): boolean =>
          results.every((result): boolean => typeof result === "boolean" && result)
        )
      );
    }
      
    return input$.pipe(
      tap((value) => (inputValue = value)),
      switchMap(composedValidator),
      map((value): [string, boolean | undefined] => [inputValue, value]),
      tap(() => errorSetter(List(errorList)))
    );
  }

  function _mapToEventEmitter(eventEmitter$: Subject<string>): FormEventHandler<HTMLInputElement> {
    return (event: FormEvent<HTMLInputElement>) => eventEmitter$.next((event.target as HTMLInputElement).value);
  }

  function _handleValueChange(propName: string, stateSetter: Dispatch<SetStateAction<boolean | undefined>>) {
    return ([value, isValid]: [string, boolean | undefined]): void => {
      stateSetter(isValid);
      formValueChanged$.next({ [propName]: value });
    };
  }

  function _debounceInput<T>(input$: Observable<T>): Observable<T> {
    return input$.pipe(debounceTime(500));
  }
  // ==========================================
  // Helper Functions
  // ==========================================

  // ==========================================
  // Validator Functions
  // ==========================================
  function _checkUser(propName: string): ValidatorFn<string> {
    return (value: string, mutativeErrorList: string[]): Observable<boolean | undefined> => {
      return iif(() => !value.length, of(undefined), checkUser({ [propName]: value })).pipe(
        tap((isValid: boolean | undefined): void => {
          if (isValid) {
            return;
          }

          const [firstChar, ...others] = propName;
          const titleCasePropName = firstChar.toUpperCase() + others.join("")

          if (isValid === undefined) {
            mutativeErrorList.push(`${titleCasePropName} is required!`);

            return;
          }

          mutativeErrorList.push(`${titleCasePropName} already taken!`);
        })
      );
    }
  }

  function _checkEmailFormat(value: string, mutativeErrorList: string[]): Observable<boolean | undefined> {
    return of(!value.length ? undefined : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)).pipe(
      tap((isValid: boolean | undefined): void => {
        if (isValid) {
          return;
        }

        if (isValid === undefined) {
          mutativeErrorList.push("Email is required!");

          return;
        }
        
        mutativeErrorList.push("Invalid Email!");
      })
    );
  }

  function _checkPassword(password: string, mutativeErrorList: string[]): Observable<boolean | undefined> {
    if (!password) {
      mutativeErrorList.push("Password is required!");
      return of(undefined);
    }

    // is at least 8 characters
    if (password.length < 8) {
      mutativeErrorList.push("Must be at least 8 characters!");
      return of(false);
    }

    // contains at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      mutativeErrorList.push("Must contain at least one lowercase letter!");
      return of(false);
    }

    // contains at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      mutativeErrorList.push("Must contain at least one uppercase letter!");
      return of(false);
    }

    // contains at least one digit
    if (!/[0-9]/.test(password)) {
      mutativeErrorList.push("Must contain at least one digit!");
      return of(false);
    }

    // contains at least one special character
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      mutativeErrorList.push("Must contain at least one special character!");
      return of(false);
    }

    return of(true);
  }

  function _checkPasswordRetype(password: string, mutativeErrorList: string[]): Observable<boolean | undefined> {
    return of(!password.length ?  undefined : formValue.password === password).pipe(tap(isValid => {
      if (!isValid) {
        mutativeErrorList.push("Does not match with password!")
      }
    }));
  }
  // ==========================================
  // Validator Functions
  // ==========================================

  return (
    <form className="gap-6 flex flex-col relative" autoComplete="off" onSubmit={onFormSubmit} >
      <FormGroup className="gap-6 flex flex-col">
        <FormControl 
          className="relative" 
          onInput={_mapToEventEmitter(usernameInput$)}
          color={typeof isUsernameValid === "boolean" ? !isUsernameValid ? "error" : "success" : "primary"} 
          error={typeof isUsernameValid === "boolean" && !isUsernameValid}
        >
          <InputLabel htmlFor="username">Username</InputLabel>
          <OutlinedInput id="username" name="username" label="Username" required/>
          {
            typeof isUsernameValid === "boolean" && 
            !isUsernameValid && 
            <FormHelperText className="absolute -bottom-5 -left-2" error>{userNameErrors.first()}</FormHelperText>
          }
        </FormControl>

        <FormControl 
          className="relative" 
          onInput={_mapToEventEmitter(emailInput$)}
          color={typeof isEmailValid === "boolean" ? !isEmailValid ? "error" : "success" : "primary"} 
          error={typeof isEmailValid === "boolean" && !isEmailValid}
        >
          <InputLabel htmlFor="email">Email</InputLabel>
          <OutlinedInput id="email" name="email" label="Email" type="email" required/>
          {
            typeof isEmailValid === "boolean" && 
            !isEmailValid && 
            <FormHelperText className="absolute -bottom-5 -left-2" error>{emailErrors.first()}</FormHelperText>
          }
        </FormControl>

        <FormControl 
          className="relative" 
          onCopy={onInputControlCopyOrPaste} 
          onPaste={onInputControlCopyOrPaste} 
          onInput={_mapToEventEmitter(passwordInput$)}
          color={typeof isPasswordValid === "boolean" ? !isPasswordValid ? "error" : "success" : "primary"} 
          error={typeof isPasswordValid === "boolean" && !isPasswordValid}
        >
          <PasswordTextField id="password" name="password" label="Password" />
          {
            typeof isPasswordValid === "boolean" && 
            !isPasswordValid && 
            <FormHelperText className="absolute -bottom-5 -left-2" error>{passwordErrors.first()}</FormHelperText>
          }
        </FormControl>

        <FormControl 
          className="relative" 
          onCopy={onInputControlCopyOrPaste} 
          onPaste={onInputControlCopyOrPaste} 
          onInput={_mapToEventEmitter(passwordRetypeInput$)}
          color={typeof isPasswordRetypeValid === "boolean" ? !isPasswordRetypeValid ? "error" : "success" : "primary"} 
          error={typeof isPasswordRetypeValid === "boolean" && !isPasswordRetypeValid}
        >
          <PasswordTextField id="password-retype" name="passwordRetype" label="Confirm Password" />
          {
            typeof isPasswordRetypeValid === "boolean" && 
            !isPasswordRetypeValid && 
            <FormHelperText className="absolute -bottom-5 -left-2" error>{passwordRetypeErrors.first()}</FormHelperText>
          }
        </FormControl>
      </FormGroup>
      <Button sx={buttonOverriddenStyles} type="submit" variant="contained">Sign Up</Button>
    </form>
  );
}

export default Form;
