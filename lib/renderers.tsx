import { produce } from "immer";
import { FormController, FormControllerProps } from "./types/form";
import {
  JSONSchemaForm,
  JSONSchemaFormElement,
} from "./types/json_schema_form";
import Input from "./components/default_form_components/Input";
import { JSONSchemaMultiTypeKeys } from "./types/json_schema";

function mergeWithObject<V>(obj1: Record<string, V>, obj2: Record<string, V>) {
  return produce(obj1, (draft) => {
    for (const key in obj2) {
      if (!Object.prototype.hasOwnProperty.call(draft, key)) {
        // @ts-expect-error - we are adding a new key to the object
        draft[key] = obj2[key];
      } else if (
        typeof draft[key] === "object" &&
        typeof obj2[key] === "object"
      ) {
        //@ts-expect-error - we are using recursion to merge objects
        draft[key] = mergeWithObject(draft[key], obj2[key]);
      } else {
        // @ts-expect-error - we are overwriting the key
        draft[key] = obj2[key];
      }
    }
  });
}

const defaultFormComponentsByType: Record<
  Exclude<JSONSchemaForm["type"], JSONSchemaMultiTypeKeys>,
  FormController
> = {
  string: Input,
  boolean: Input,
  number: Input,
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

export default function defaultRenderer({
  formComponentsByType: _formComponentsByType = {},
  formComponentsByFormType: _formComponentsByFormType = {},
  formComponentsByProperty: _formComponentsByProperty = {},
  ...props
}: FormControllerProps<JSONSchemaForm> & {
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
}) {
  const formComponentsByType = mergeWithObject(
    defaultFormComponentsByType,
    _formComponentsByType,
  );
  const formComponentsByFormType = mergeWithObject(
    defaultFormComponentsByFormType,
    _formComponentsByFormType,
  );
  const formComponentsByProperty = mergeWithObject(
    {},
    _formComponentsByProperty,
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
    props.formProperties.type &&
    formComponentsByFormType[props.formProperties.type]
  ) {
    const FormComponent = formComponentsByFormType[props.formProperties.type];
    return <FormComponent {...props} />;
  } else if (formComponentsByType) {
    if (Array.isArray(props.schema.type)) {
      for (const type of props.schema.type) {
        if (formComponentsByType[type]) {
          const FormComponent = formComponentsByType[type];
          return <FormComponent {...props} />;
        }
      }
    } else if (formComponentsByType[props.schema.type]) {
      const FormComponent = formComponentsByType[props.schema.type];
      return <FormComponent {...props} />;
    }
  }

  // If no component is found, return nothing. Mark the field as hidden.
  return <></>;
}
