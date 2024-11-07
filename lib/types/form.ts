import { FC } from "react";
import {
  JSFCustomControlSchema,
  JSFCustomSchema,
  JSFType,
  JSFTypeToJSONSchemaFormType,
  JSONSchemaForm,
} from "./json_schema_form";

// ComponentRenderPreferences is a type that defines the preferences for rendering components
export interface ComponentRenderPreferences {
  preferPropertyComponent?: boolean;
  preferSchemaTypeComponent?: boolean;
  preferFormTypeComponent?: boolean;
}

// FormRenderer is a component that renders a form element
export interface FormRendererProps<SchemaType extends JSONSchemaForm>
  extends ComponentRenderPreferences {
  schema: SchemaType;
  parentProperty: string;
  property: string;
}

// OutletRendererProps is the props type for OutletRenderer
export type OutletRendererProps = Partial<FormRendererProps<JSONSchemaForm>>;

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
  Outlet: FC<OutletRendererProps>;
  fullProperty: string;
  property: string;
  getValue: <T = unknown>(key: string) => T | undefined;
  setValue: (key: string, value: unknown) => void;
  onChange: (value: unknown) => void;
  value: unknown;
  schema: S;
  rootSchema: RS;
  formProperties: S["formProperties"];
  componentPreference: ComponentRenderPreferences;
}

// FormTypeController is a component that provides a way to control a form element based on form type
export type FormTypeController<K extends JSFType> = FormController<
  JSONSchemaForm,
  Required<JSFTypeToJSONSchemaFormType<K>>
>;

export type FormTypeCustomController<CType extends string = string> =
  FormController<JSONSchemaForm, Required<JSFCustomSchema<CType>>>;

export type FormTypeCustomControlController<CCType extends string = string> =
  FormController<JSONSchemaForm, Required<JSFCustomControlSchema<CCType>>>;
