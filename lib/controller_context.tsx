import { createContext, useContext } from "react";
import { JSONSchemaForm } from "./types/json_schema_form";
import { FormController } from "./types/form";

export interface FormControllerContextValue<
  RS extends JSONSchemaForm = JSONSchemaForm,
> {
  rootSchema: RS;
  render: FormController<RS, JSONSchemaForm>;
  setValue: (key: string, value: unknown) => void;
  getValue: <T = unknown>(key: string) => T | undefined;
}

// eslint-disable-next-line react-refresh/only-export-components
export const FormControllerContext = createContext<
  FormControllerContextValue | undefined
>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useFormControllerContext = <
  RS extends JSONSchemaForm = JSONSchemaForm,
>() =>
  useContext(
    FormControllerContext as React.Context<FormControllerContextValue<RS>>,
  );

export function FormControllerProvider<
  RS extends JSONSchemaForm = JSONSchemaForm,
>({
  children,
  rootSchema,
  render,
  setValue,
  getValue,
}: {
  children: React.ReactNode;
  rootSchema: RS;
  render: FormController;
  setValue: (key: string, value: unknown) => void;
  getValue: <T = unknown>(key: string) => T | undefined;
}) {
  return (
    <FormControllerContext.Provider
      value={{ rootSchema, render, getValue, setValue }}
    >
      {children}
    </FormControllerContext.Provider>
  );
}
