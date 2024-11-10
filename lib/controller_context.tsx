import { createContext, useContext } from "react";
import { JSONSchemaForm } from "./types/json_schema_form";
import { FormFieldRenderer } from "./types/form";

// FormControllerContext is a context that provides a set of
// functions to interact with the form controller. This avoids
// prop drilling and makes it easier to interact with the form.
export interface FormControllerContextValue<
  RS extends JSONSchemaForm = JSONSchemaForm,
  S extends JSONSchemaForm = JSONSchemaForm,
> {
  rootSchema: RS;
  render: FormFieldRenderer<RS, S>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const FormControllerContext = createContext<
  FormControllerContextValue | undefined
>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useFormControllerContext = <
  RS extends JSONSchemaForm = JSONSchemaForm,
  S extends JSONSchemaForm = JSONSchemaForm,
>() =>
  useContext(
    FormControllerContext as React.Context<FormControllerContextValue<RS, S>>,
  );

export function FormControllerProvider<
  RS extends JSONSchemaForm = JSONSchemaForm,
>({
  children,
  rootSchema,
  render,
}: {
  children: React.ReactNode;
  rootSchema: RS;
  render: FormFieldRenderer;
}) {
  return (
    <FormControllerContext.Provider value={{ rootSchema, render }}>
      {children}
    </FormControllerContext.Provider>
  );
}
