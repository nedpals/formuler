import {
  FormController,
  FormControllerProps,
  FormTypeController,
  FormTypeCustomControlController,
  FormTypeCustomController,
} from "./types/form";
import { JSFType, JSONSchemaForm } from "./types/json_schema_form";
import { JSONSchema, JSONSchemaMultiTypeKeys } from "./types/json_schema";
import { mergeWithObject } from "./utils";
import { useMemo } from "react";
import {
  ArrayRender,
  Image as _Image,
  Input,
  ObjectRender,
  RichText,
  Section,
  Text,
  Video,
  Layout,
  Oembed,
} from "./components";

export type FormComponentsByTypeMap = {
  [K in Exclude<
    JSONSchemaForm["type"],
    JSONSchemaMultiTypeKeys
  >]?: FormController<JSONSchemaForm, Extract<JSONSchema, { type: K }>>;
};

const defaultFormComponentsByType: FormComponentsByTypeMap = {
  string: Input,
  boolean: Input,
  number: Input,
  integer: Input,
  null: () => null,
  array: ArrayRender,
  object: ObjectRender,
};

export type FormComponentsByFormTypeMap = {
  [K in JSFType]?: FormTypeController<K>;
};

const defaultFormComponentsByFormType: FormComponentsByFormTypeMap = {
  input: Input,
  section: Section,
  "rich-text": RichText,
  text: Text,
  image: _Image,
  video: Video,
  layout: Layout,
  oembed: Oembed,
};

export interface DefaultRendererProps {
  formComponentsByType?: FormComponentsByTypeMap;
  formComponentsByFormType?: FormComponentsByFormTypeMap;
  formComponentsByProperty?: Record<string, FormController>; // TODO: make it type safe. property refers to either the full property or the property
  formComponentsByCustomType?: Record<string, FormTypeCustomController>;
  formComponentsByCustomControlType?: Record<
    string,
    FormTypeCustomControlController
  >;
  formComponentsByLayoutName?: Record<string, FormTypeController<"layout">>;
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
      formComponentsByCustomType={renderProps?.formComponentsByCustomType ?? {}}
      formComponentsByCustomControlType={
        renderProps?.formComponentsByCustomControlType ?? {}
      }
      formComponentsByLayoutName={renderProps?.formComponentsByLayoutName ?? {}}
      {...props}
    />
  );
}

// DefaultRenderer is a component that renders the form based on the schema type.
export default function DefaultRenderer({
  formComponentsByType: _formComponentsByType = {},
  formComponentsByFormType: _formComponentsByFormType = {},
  formComponentsByProperty: _formComponentsByProperty = {},
  formComponentsByCustomType: _formComponentsByCustomType = {},
  formComponentsByCustomControlType: _formComponentsByCustomControlType = {},
  formComponentsByLayoutName: _formComponentsByLayoutName = {},
  ...props
}: FormControllerProps & DefaultRendererProps) {
  const {
    preferFormTypeComponent,
    preferPropertyComponent,
    preferSchemaTypeComponent,
  } = props.componentPreference;

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

  const formComponentsByCustomType = useMemo(
    () => mergeWithObject({}, _formComponentsByCustomType),
    [_formComponentsByCustomType],
  );

  const formComponentsByCustomControlType = useMemo(
    () => mergeWithObject({}, _formComponentsByCustomControlType),
    [_formComponentsByCustomControlType],
  );

  const formComponentsByLayoutName = useMemo(
    () => mergeWithObject({}, _formComponentsByLayoutName),
    [_formComponentsByLayoutName],
  );

  // Hierarchical order of precedence for component lookup:
  // 1. formComponentsByProperty
  // 2. formComponentsByFormType
  // 3. formComponentsByType
  if (
    preferPropertyComponent &&
    formComponentsByProperty &&
    props.property &&
    formComponentsByProperty[props.property]
  ) {
    const FormComponent = formComponentsByProperty[props.property];
    return <FormComponent {...props} />;
  } else if (
    preferFormTypeComponent &&
    formComponentsByFormType &&
    props.formProperties &&
    props.formProperties.type
  ) {
    const formType = props.formProperties.type;

    if (
      formType === "layout" &&
      props.formProperties.name &&
      formComponentsByLayoutName[props.formProperties.name]
    ) {
      const FormComponent = formComponentsByLayoutName[
        props.formProperties.name
      ] as FormController;
      return <FormComponent {...props} />;
    } else if (formType === "custom") {
      const customType = props.formProperties.customContentType;
      if (formComponentsByCustomType[customType]) {
        const FormComponent = formComponentsByCustomType[
          customType
        ] as FormController;
        return <FormComponent {...props} />;
      }
    } else if (formType === "custom-control") {
      const controlType = props.formProperties.controlType;
      if (formComponentsByCustomControlType[controlType]) {
        const FormComponent = formComponentsByCustomControlType[
          controlType
        ] as FormController;
        return <FormComponent {...props} />;
      }
    } else if (formComponentsByFormType[formType]) {
      const FormComponent = formComponentsByFormType[
        formType
      ] as FormController;
      return <FormComponent {...props} />;
    }
  } else if (preferSchemaTypeComponent) {
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
