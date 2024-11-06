import { FC } from "react";
import { JSONSchemaForm } from "./json_schema_form";

// FormRenderer is a component that renders a form element
export interface FormRendererProps<SchemaType extends JSONSchemaForm> {
  schema: SchemaType;
  parentProperty: string;
  property: string;
}

// FormController is a component that provides a way to control a form element
export type FormController<
  RS extends JSONSchemaForm = JSONSchemaForm,
  S extends JSONSchemaForm = JSONSchemaForm,
> = FC<FormControllerProps<RS, S>>;

// FormControllerProps is the props type for FormController
export interface FormControllerProps<
  RS extends JSONSchemaForm = JSONSchemaForm,
  S extends JSONSchemaForm = JSONSchemaForm,
> {
  Outlet: FC<FormRendererProps<S>>;
  fullProperty: string;
  property: string;
  getValue: <T = unknown>(key: string) => T | undefined;
  setValue: (key: string, value: unknown) => void;
  onChange: (value: unknown) => void;
  value: unknown;
  schema: S;
  rootSchema: RS;
  formProperties: S["formProperties"];
}
