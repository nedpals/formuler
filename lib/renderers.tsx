import { FormController, FormControllerProps } from "./types/form";
import {
  JSFType,
  JSFTypeToJSONSchemaFormType,
  JSONSchemaForm,
} from "./types/json_schema_form";
import Input from "./components/default_form_components/Input";
import { JSONSchema, JSONSchemaMultiTypeKeys } from "./types/json_schema";
import { mergeWithObject } from "./utils";
import { useMemo } from "react";

export type FormComponentsByTypeMap = {
  [K in Exclude<
    JSONSchemaForm["type"],
    JSONSchemaMultiTypeKeys
  >]?: FormController<Extract<JSONSchema, { type: K }>>;
};

const defaultFormComponentsByType: FormComponentsByTypeMap = {
  string: Input,
  boolean: Input,
  number: Input,
  integer: Input,
  null: () => null,
  array: ({ Outlet, schema, fullProperty, property }) => (
    <Outlet schema={schema} parentProperty={fullProperty} property={property} />
  ),
  object: ({ Outlet, schema, fullProperty, property }) => (
    <Outlet schema={schema} parentProperty={fullProperty} property={property} />
  ),
};

export type FormTypeController<K extends JSFType> = FormController<
  JSONSchemaForm,
  Required<JSFTypeToJSONSchemaFormType<K>>
>;

export type FormComponentsByFormTypeMap = {
  [K in JSFType]?: FormTypeController<K>;
};

const defaultFormComponentsByFormType: FormComponentsByFormTypeMap = {
  input: Input,
};

export interface DefaultRendererProps {
  formComponentsByType?: FormComponentsByTypeMap;
  formComponentsByFormType?: FormComponentsByFormTypeMap;
  formComponentsByProperty?: Record<string, FormController>; // TODO: make it type safe. property refers to either the full property or the property
}

// createRenderer is a factory function that creates a renderer component.
// You can use this to override the default form components when using it
// inside the `render` prop of the `FormRenderer` component.
//
// eslint-disable-next-line react-refresh/only-export-components
export function createRenderer(
  renderProps?: DefaultRendererProps,
): FormController {
  return (props) => (
    <DefaultRenderer
      formComponentsByType={renderProps?.formComponentsByType ?? {}}
      formComponentsByFormType={renderProps?.formComponentsByFormType ?? {}}
      formComponentsByProperty={renderProps?.formComponentsByProperty ?? {}}
      {...props}
    />
  );
}

// DefaultRenderer is a component that renders the form based on the schema type.
export default function DefaultRenderer({
  formComponentsByType: _formComponentsByType = {},
  formComponentsByFormType: _formComponentsByFormType = {},
  formComponentsByProperty: _formComponentsByProperty = {},
  ...props
}: FormControllerProps & DefaultRendererProps) {
  const formComponentsByType = useMemo(
    () => mergeWithObject(defaultFormComponentsByType, _formComponentsByType),
    [_formComponentsByType],
  );

  const formComponentsByFormType = useMemo(
    () =>
      mergeWithObject(
        defaultFormComponentsByFormType,
        _formComponentsByFormType,
      ),
    [_formComponentsByFormType],
  );

  const formComponentsByProperty = useMemo(
    () => mergeWithObject({}, _formComponentsByProperty),
    [_formComponentsByProperty],
  );

  // Hierarchical order of precedence for component lookup:
  // 1. formComponentsByProperty
  // 2. formComponentsByFormType
  // 3. formComponentsByType
  if (
    formComponentsByProperty &&
    props.property &&
    formComponentsByProperty[props.property]
  ) {
    const FormComponent = formComponentsByProperty[props.property];
    return <FormComponent {...props} />;
  } else if (
    formComponentsByFormType &&
    props.formProperties &&
    props.formProperties.type
  ) {
    const formType = props.formProperties.type;
    if (formComponentsByFormType[formType]) {
      const FormComponent = formComponentsByFormType[
        formType
      ] as FormController;
      return <FormComponent {...props} />;
    }
  } else if (formComponentsByType) {
    const typesList = Array.isArray(props.schema.type)
      ? props.schema.type
      : [props.schema.type];

    for (const type of typesList) {
      if (formComponentsByType[type]) {
        const FormComponent = formComponentsByType[type] as FormController;
        return <FormComponent {...props} />;
      }
    }
  }

  // If no component is found, return nothing. Mark the field as hidden.
  return <></>;
}
