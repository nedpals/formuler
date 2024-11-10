/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useContext, useMemo } from "react";

export interface SimpleFormContextValue<T = unknown> {
  onChange: (value: T) => void;
  value: T;

  getValue: <T = unknown>(key: string) => T | undefined;
  setValue: (key: string, value: unknown) => void;

  dispatch: (name: string, payload: unknown) => void;
}

export const SimpleFormContext = createContext<
  SimpleFormContextValue | undefined
>({
  value: {},
  getValue: (_key) => undefined,
  onChange: (_value) => {},
  setValue: (_key, _value) => {},
  dispatch: (_name, _payload) => {},
});

export const useSimpleFormContext = <T = unknown>() =>
  useContext(SimpleFormContext as React.Context<SimpleFormContextValue<T>>);

export interface SimpleFormControllerContextValue<T = unknown> {
  onChange: (value: T) => void;
  dispatch: (name: string, payload: unknown) => void;
  value: T;
}

export const useSimpleFormController = <T = unknown>(key: string) => {
  const { setValue, getValue, value, dispatch } = useSimpleFormContext();
  const fieldValue = useMemo(() => getValue<T>(key), [value]);

  return {
    onChange(value) {
      setValue(key, value);
    },
    value: fieldValue,
    dispatch,
  } as SimpleFormControllerContextValue<T>;
};
