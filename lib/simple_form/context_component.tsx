import { memo, ReactNode, useCallback, useMemo } from "react";
import { SimpleFormContext, SimpleFormContextValue } from "./context";
import { getProperty, setProperty } from "dot-prop";
import { produce } from "immer";

export const SimpleForm = memo(
  <T = unknown,>({
    children,
    onChange,
    onEvent,
    value,
  }: Omit<SimpleFormContextValue<T>, "getValue" | "setValue" | "dispatch"> & {
    onEvent?: (name: string, payload: unknown) => void;
    children: ReactNode;
  }) => {
    const getValue = useCallback(
      (key: string) => {
        if (typeof value !== "object") {
          if (key === "*") {
            return value;
          } else {
            return undefined;
          }
        }
        return getProperty(value, key);
      },
      [value],
    );

    const setValue = useCallback(
      (key: string, newValue: unknown) => {
        if (typeof value === "undefined" || typeof value === "undefined") {
          console.error("Value is undefined");
          return;
        } else if (!value) {
          console.error("Value is falsy", { value: value });
          return;
        }

        const prevValue = key === "*" ? value : getProperty(value, key);
        if (typeof prevValue !== typeof newValue) {
          console.error("New value has different type than the old value", {
            value,
            newValue,
          });
          return;
        } else if (typeof newValue === "undefined") {
          console.error("Value is undefined");
          return;
        } else if (prevValue === value && typeof prevValue !== "object") {
          if (key !== "*") {
            console.error("Invalid key", key);
            return;
          }

          onChange?.(newValue as T);
        } else if (key === "*") {
          console.error("Rewriting the whole value is not allowed");
          return;
        }

        onChange(produce(value, (draft) => setProperty(draft, key, newValue)));
      },
      [value],
    );

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const dispatch = useCallback(
      onEvent ?? ((_n: string, _p: unknown) => {}),
      [],
    );

    const _contextValue = useMemo(
      () =>
        ({
          onChange,
          value,
          getValue,
          setValue,
          dispatch,
        }) as SimpleFormContextValue,
      [value],
    );

    return (
      <SimpleFormContext.Provider value={_contextValue}>
        {children}
      </SimpleFormContext.Provider>
    );
  },
);

SimpleForm.displayName = "SimpleForm";
