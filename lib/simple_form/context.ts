import React, { createContext, useContext, useMemo } from "react";

export interface SimpleFormContextValue<T = unknown> {
  onChange: (value: T) => void;
  value: T;

  getValue: <T = unknown>(key: string) => T | undefined;
  setValue: (key: string, value: unknown) => void;
}

export const SimpleFormContext = createContext<
  SimpleFormContextValue | undefined
>(undefined);

export const useSimpleFormContext = <T = unknown>() =>
  useContext(SimpleFormContext as React.Context<SimpleFormContextValue<T>>);

export interface SimpleFormControllerContextValue<T = unknown> {
  onChange: (value: T) => void;
  value: T;
}

export const useSimpleFormController = <T = unknown>(key: string) => {
  const { setValue, getValue, value } = useSimpleFormContext();
  const fieldValue = useMemo(() => getValue<T>(key), [value]);

  return {
    onChange(value) {
      setValue(key, value);
    },
    value: fieldValue,
  } as SimpleFormControllerContextValue<T>;
};
