/* eslint-disable react-hooks/exhaustive-deps */
import { Button, FormControl, FormGroup, FormHelperText, InputLabel, OutlinedInput, SxProps, Theme } from "@mui/material";
import { Observable, Subject, debounceTime, forkJoin, iif, map, of, switchMap, takeUntil, tap } from "rxjs";
import { ClipboardEvent, FormEvent, FormEventHandler, useEffect } from "react"; 
import { Signal, useSignal } from "@preact/signals-react";
import { useToastContext } from "../../../../shared/providers/toast.provider";
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
  const { showToast } = useToastContext();

  const buttonOverriddenStyles: SxProps<Theme> = { padding: '0', height: '50px', width: '100%', borderRadius: '5px' };
  const initErrorList = List<string>();
  
  // Form value
  const formValue = useSignal(new SignUpFormDto());

  // Validation status
  const isUsernameValid = useSignal<boolean | undefined>(undefined);
  const isEmailValid = useSignal<boolean | undefined>(undefined);
  const isPasswordValid = useSignal<boolean | undefined>(undefined);
  const isPasswordRetypeValid = useSignal<boolean | undefined>(undefined);

  // Validation Errors
  const userNameErrors = useSignal<List<string>>(initErrorList);
  const emailErrors = useSignal<List<string>>(initErrorList);
  const passwordErrors = useSignal<List<string>>(initErrorList);
  const passwordRetypeErrors = useSignal<List<string>>(initErrorList);

  // Form event
  const { value: formValueChanged$ } = useSignal(new Subject<Partial<ISignUpFormDto>>());

  // Form Control events
  const { value: usernameInput$ } = useSignal(new Subject<string>());
  const { value: emailInput$ } = useSignal(new Subject<string>());
  const { value: passwordInput$ } = useSignal(new Subject<string>());
  const { value: passwordRetypeInput$ } = useSignal(new Subject<string>());

  // ==========================================
  // Event Handlers
  // ==========================================
  function onInputControlCopyOrPaste(event: ClipboardEvent<HTMLInputElement>): void {
    event.preventDefault();
  }

  function onFormValueChanged(obj: Partial<ISignUpFormDto>): void {
    const [[key, value]] = Object.entries(obj);

    if (key === SignUpControl.PASSWORD && formValue.value.passwordRetype) {
      const validRetype = formValue.value.passwordRetype === value

      if (!validRetype) {
        passwordRetypeErrors.value = List(["Does not match with password!"]);
      }

      isPasswordRetypeValid.value = validRetype;
    }

    formValue.value = formValue.value.set(key as keyof ISignUpFormDto, value);
  }

  function onFormSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!_isFormValid()) {
      showToast("Please check invalid fields", { severity: "error" });
      return;
    }

    onSubmit(new SignUpDto(formValue.value));
  }
  // ==========================================
  // Event Handlers
  // ==========================================

  useEffect(() => {
    const onDestroy$ = new Subject<void>();

    const lowerCaseUserNameInput$ = _debounceInput(usernameInput$).pipe(
      map((username) => username.toLowerCase())
    );
    
    // Input value change events
    const usernameValueChanged$ = _validateInputValue(lowerCaseUserNameInput$, [_checkUser(SignUpControl.USERNAME)], userNameErrors);
    const emailValueChanged$ = _validateInputValue(_debounceInput(emailInput$), [_checkEmailFormat, _checkUser(SignUpControl.EMAIL)], emailErrors);
    const passwordValueChanged$ = _validateInputValue(_debounceInput(passwordInput$), [_checkPassword], passwordErrors);
    const passwordRetypeValueChanged$ = _validateInputValue(_debounceInput(passwordRetypeInput$), [_checkPasswordRetype], passwordRetypeErrors);

    _register(formValueChanged$, onFormValueChanged);
    _register(usernameValueChanged$, _handleValueChange(SignUpControl.USERNAME, isUsernameValid));
    _register(emailValueChanged$, _handleValueChange(SignUpControl.EMAIL,isEmailValid));
    _register(passwordValueChanged$, _handleValueChange(SignUpControl.PASSWORD,isPasswordValid));
    _register(passwordRetypeValueChanged$, _handleValueChange(SignUpControl.PASSWORD_RETYPE, isPasswordRetypeValid));

    function _register<T>(observable$: Observable<T>, subscriber: (data: T) => void) {
      observable$.pipe(takeUntil(onDestroy$)).subscribe(subscriber);
    }

    return () => onDestroy$.next();
  }, [isUsernameValid.value, isEmailValid.value, isPasswordValid.value, isPasswordRetypeValid.value, formValue.value]);

  // ==========================================
  // Helper Functions
  // ==========================================
  function _validateInputValue(input$: Observable<string>, validatorFn: ValidatorFn<string>[], signal: Signal<List<string>>): Observable<[string, boolean | undefined]> {
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
      tap(() => signal.value = List(errorList))
    );
  }

  function _mapToEventEmitter(eventEmitter$: Subject<string>): FormEventHandler<HTMLInputElement> {
    return (event: FormEvent<HTMLInputElement>) => eventEmitter$.next((event.target as HTMLInputElement).value);
  }

  function _handleValueChange(propName: string, signal: Signal<boolean | undefined>) {
    return ([value, isValid]: [string, boolean | undefined]): void => {
      signal.value = isValid
      formValueChanged$.next({ [propName]: value });
    };
  }

  function _debounceInput<T>(input$: Observable<T>): Observable<T> {
    return input$.pipe(debounceTime(500));
  }

  function _isFormValid(): boolean {
    return Boolean(
      isUsernameValid.value &&
        isEmailValid.value &&
        isPasswordValid.value &&
        isPasswordRetypeValid.value
    ).valueOf();
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
    return of(!password.length ?  undefined : formValue.value.password === password).pipe(tap(isValid => {
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
          color={typeof isUsernameValid.value === "boolean" ? !isUsernameValid.value ? "error" : "success" : "primary"} 
          error={typeof isUsernameValid.value === "boolean" && !isUsernameValid.value}
        >
          <InputLabel htmlFor="username">Username</InputLabel>
          <OutlinedInput id="username" name="username" label="Username" required/>
          {
            typeof isUsernameValid.value === "boolean" && 
            !isUsernameValid.value && 
            <FormHelperText className="absolute -bottom-5 -left-2" error>{userNameErrors.value.first()}</FormHelperText>
          }
        </FormControl>

        <FormControl 
          className="relative" 
          onInput={_mapToEventEmitter(emailInput$)}
          color={typeof isEmailValid.value === "boolean" ? !isEmailValid.value ? "error" : "success" : "primary"} 
          error={typeof isEmailValid.value === "boolean" && !isEmailValid.value}
        >
          <InputLabel htmlFor="email">Email</InputLabel>
          <OutlinedInput id="email" name="email" label="Email" type="email" required/>
          {
            typeof isEmailValid.value === "boolean" && 
            !isEmailValid.value && 
            <FormHelperText className="absolute -bottom-5 -left-2" error>{emailErrors.value.first()}</FormHelperText>
          }
        </FormControl>

        <FormControl 
          className="relative" 
          onCopy={onInputControlCopyOrPaste} 
          onPaste={onInputControlCopyOrPaste} 
          onInput={_mapToEventEmitter(passwordInput$)}
          color={typeof isPasswordValid.value === "boolean" ? !isPasswordValid.value ? "error" : "success" : "primary"} 
          error={typeof isPasswordValid.value === "boolean" && !isPasswordValid.value}
        >
          <PasswordTextField id="password" name="password" label="Password" />
          {
            typeof isPasswordValid.value === "boolean" && 
            !isPasswordValid.value && 
            <FormHelperText className="absolute -bottom-5 -left-2" error>{passwordErrors.value.first()}</FormHelperText>
          }
        </FormControl>

        <FormControl 
          className="relative" 
          onCopy={onInputControlCopyOrPaste} 
          onPaste={onInputControlCopyOrPaste} 
          onInput={_mapToEventEmitter(passwordRetypeInput$)}
          color={typeof isPasswordRetypeValid.value === "boolean" ? !isPasswordRetypeValid.value ? "error" : "success" : "primary"} 
          error={typeof isPasswordRetypeValid.value === "boolean" && !isPasswordRetypeValid.value}
        >
          <PasswordTextField id="password-retype" name="passwordRetype" label="Confirm Password" />
          {
            typeof isPasswordRetypeValid.value === "boolean" && 
            !isPasswordRetypeValid.value && 
            <FormHelperText className="absolute -bottom-5 -left-2" error>{passwordRetypeErrors.value.first()}</FormHelperText>
          }
        </FormControl>
      </FormGroup>
      <Button sx={buttonOverriddenStyles} type="submit" variant="contained">Sign Up</Button>
    </form>
  );
}

export default Form;
