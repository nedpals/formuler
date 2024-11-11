import { FC } from "react";
import {
  JSFCustomControlSchema,
  JSFCustomSchema,
  JSFType,
  JSFTypeToJSONSchemaFormType,
  JSONSchemaForm,
} from "./jsf";

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

// FormFieldRenderer is a component that provides a way to control a form element
export type FormFieldRenderer<
  RS extends JSONSchemaForm = JSONSchemaForm,
  S extends JSONSchemaForm = JSONSchemaForm,
> = FC<FormFieldRendererProps<RS, S>>;

// FormFieldRendererProps is the props type for FormController
export interface FormFieldRendererProps<
  RS extends JSONSchemaForm = JSONSchemaForm,
  S extends JSONSchemaForm = JSONSchemaForm,
> {
  Outlet: FC<OutletRendererProps>;
  fullProperty: string;
  property: string;
  schema: S;
  rootSchema: RS;
  formProperties: S["formProperties"];
  preference: ComponentRenderPreferences;
}

// FormTypeFieldRenderer is a component that provides a way to control a form element based on form type
export type FormTypeFieldRenderer<K extends JSFType> = FormFieldRenderer<
  JSONSchemaForm,
  Required<JSFTypeToJSONSchemaFormType<K>>
>;

export type FormTypeCustomFieldRenderer<CType extends string = string> =
  FormFieldRenderer<JSONSchemaForm, Required<JSFCustomSchema<CType>>>;

export type FormTypeCustomControlFieldRenderer<CCType extends string = string> =
  FormFieldRenderer<JSONSchemaForm, Required<JSFCustomControlSchema<CCType>>>;
