import { createContext, useContext } from "react";
import { JSONSchemaForm } from "./types/json_schema_form";
import { FormFieldRenderer } from "./types/form";

// FormRenderContext is a context that provides a set of
// functions to interact with the form render. This avoids
// prop drilling and makes it easier to interact with the form.
export interface FormRenderContextValue<
  RS extends JSONSchemaForm = JSONSchemaForm,
  S extends JSONSchemaForm = JSONSchemaForm,
> {
  rootSchema: RS;
  render: FormFieldRenderer<RS, S>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const FormRenderContext = createContext<
  FormRenderContextValue | undefined
>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useFormRenderContext = <
  RS extends JSONSchemaForm = JSONSchemaForm,
  S extends JSONSchemaForm = JSONSchemaForm,
>() =>
  useContext(FormRenderContext as React.Context<FormRenderContextValue<RS, S>>);

export function FormRenderProvider<RS extends JSONSchemaForm = JSONSchemaForm>({
  children,
  rootSchema,
  render,
}: {
  children: React.ReactNode;
  rootSchema: RS;
  render: FormFieldRenderer;
}) {
  return (
    <FormRenderContext.Provider value={{ rootSchema, render }}>
      {children}
    </FormRenderContext.Provider>
  );
}
