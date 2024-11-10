import { ReactNode, useCallback } from "react";
import { SimpleFormContext, SimpleFormContextValue } from "./context";
import { getProperty, setProperty } from "dot-prop";
import { produce } from "immer";

export function SimpleForm<T = unknown>({
  children,
  onChange,
  value,
}: Omit<SimpleFormContextValue<T>, "getValue" | "setValue"> & {
  children: ReactNode;
}) {
  const getValue = useCallback(
    (key: string) => {
      if (typeof value !== "object") {
        if (key === "*") {
          return value;
        } else {
          return undefined;
        }
      }
      console.log(`[getValue] ${key}`, value);
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

  return (
    <SimpleFormContext.Provider
      value={
        {
          onChange,
          value,
          getValue,
          setValue,
        } as SimpleFormContextValue
      }
    >
      {children}
    </SimpleFormContext.Provider>
  );
}

SimpleForm.displayName = "SimpleForm";
