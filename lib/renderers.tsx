import { FormController, FormControllerProps } from "./types/form";
import {
  JSONSchemaForm,
  JSONSchemaFormElement,
} from "./types/json_schema_form";
import Input from "./components/default_form_components/Input";
import { JSONSchemaMultiTypeKeys } from "./types/json_schema";
import { mergeWithObject } from "./utils";
import { useMemo } from "react";

const defaultFormComponentsByType: Record<
  Exclude<JSONSchemaForm["type"], JSONSchemaMultiTypeKeys>,
  FormController
> = {
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

const defaultFormComponentsByFormType: {
  [K in JSONSchemaFormElement["type"]]?: FormController;
} = {
  input: Input,
};

interface DefaultRendererProps {
  formComponentsByType?: {
    [K in Exclude<
      JSONSchemaForm["type"],
      JSONSchemaMultiTypeKeys
    >]?: FormController;
  };
  formComponentsByFormType?: {
    [K in JSONSchemaFormElement["type"]]?: FormController;
  };
  formComponentsByProperty?: Record<string, FormController>; // TODO: make it type safe. property refers to either the full property or the property
}

// createRenderer is a factory function that creates a renderer component.
// You can use this to override the default form components when using it
// inside the `render` prop of the `FormRenderer` component.
//
// eslint-disable-next-line react-refresh/only-export-components
export function createRenderer({
  formComponentsByType = {},
  formComponentsByFormType = {},
  formComponentsByProperty = {},
}: FormControllerProps & DefaultRendererProps): FormController {
  return (props) => (
    <DefaultRenderer
      formComponentsByType={formComponentsByType}
      formComponentsByFormType={formComponentsByFormType}
      formComponentsByProperty={formComponentsByProperty}
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
      const FormComponent = formComponentsByFormType[formType];
      return <FormComponent {...props} />;
    }
  } else if (formComponentsByType) {
    if (Array.isArray(props.schema.type)) {
      for (const type of props.schema.type) {
        if (
          formComponentsByType[type] &&
          typeof formComponentsByType[type] !== "undefined"
        ) {
          const FormComponent = formComponentsByType[type];
          return <FormComponent {...props} />;
        }
      }
    } else {
      const schemaType = props.schema.type;
      if (formComponentsByType[schemaType]) {
        const FormComponent = formComponentsByType[schemaType];
        return <FormComponent {...props} />;
      }
    }
  }

  // If no component is found, return nothing. Mark the field as hidden.
  return <></>;
}
