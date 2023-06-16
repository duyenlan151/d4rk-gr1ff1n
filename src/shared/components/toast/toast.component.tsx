/* eslint-disable react-hooks/exhaustive-deps */
import { PropsWithChildren, SyntheticEvent, useEffect } from "react";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import { ToastContext } from "../../providers/toast.provider";
import { Record, Stack } from "immutable";
import { useSignal } from "@preact/signals-react";

export interface IToasOptions {
  severity: AlertColor;
  duration: number;
}

class ToastOptions extends Record<IToasOptions>({
  severity: "success",
  duration: 6000,
}) {}

interface IToastMessage {
  message: string;
  key: number;
  options: ToastOptions;
}

class ToastMessage extends Record<IToastMessage>({
  message: "empty",
  key: Date.now(),
  options: new ToastOptions(),
}) {}

function ToastProvider({ children }: PropsWithChildren) {
  const _isVisible = useSignal(false);
  const _messages = useSignal<Stack<ToastMessage>>(Stack());
  const _message = useSignal<ToastMessage | undefined>(undefined);

  function onClose(_event?: SyntheticEvent | Event, reason?: string): void {
    if (reason === "clickaway") {
      return;
    }

    _isVisible.value = false;
  }

  function onToastExit(): void {
    _message.value = undefined;
  }

  function showToast(message: string, options?: Partial<IToasOptions>): void {
    const _newMessage = new ToastMessage({
      key: Date.now(),
      message,
      options: new ToastOptions(options),
    });

    _messages.value = _messages.value.push(_newMessage);
  }

  function _processPendingMessages() {
    if (_messages.value.size && !_message.value) {
      _message.value = _messages.value.first();
      _messages.value = _messages.value.pop();
      _isVisible.value = true;
    }
  }

  useEffect(() => {
    _processPendingMessages();
  }, [_messages.value, _isVisible.value, _message.value]);
  
  return (
    <ToastContext.Provider value={{ showToast }}>
      <Snackbar key={_message.value?.key} open={_isVisible.value} autoHideDuration={_message.value?.options.duration} onClose={onClose} TransitionProps={{ onExited: onToastExit }}>
        <Alert onClose={onClose} variant="filled" severity={_message.value?.options.severity ?? "success"} sx={{ width: "100%" }}>
          {_message.value?.message}
        </Alert>
      </Snackbar>
      {children}
    </ToastContext.Provider>
  );
}

export default ToastProvider;
