import { memo, useMemo } from "react";
import {
  FormFieldRenderer,
  FormFieldRendererProps,
  FormTypeFieldRenderer,
  FormTypeCustomControlFieldRenderer,
  FormTypeCustomFieldRenderer,
} from "../form_types";
import { mergeWithObject } from "./utils";
import {
  defaultFormComponentsByFormType,
  defaultFormComponentsByType,
} from "./default_components";
import FormComponentSlots, {
  FormComponentsByFormTypeMap,
  FormComponentsByTypeMap,
} from "../components/FormComponentSlots";

export interface SimpleFormRendererProps {
  formComponentsByType?: FormComponentsByTypeMap;
  formComponentsByFormType?: FormComponentsByFormTypeMap;
  formComponentsByProperty?: Record<string, FormFieldRenderer>; // TODO: make it type safe. property refers to either the full property or the property
  formComponentsByCustomType?: Record<string, FormTypeCustomFieldRenderer>;
  formComponentsByCustomControlType?: Record<
    string,
    FormTypeCustomControlFieldRenderer
  >;
  formComponentsByLayoutName?: Record<string, FormTypeFieldRenderer<"layout">>;
}

// SimpleFormRenderer is a component that renders the form based on the schema type.
export const SimpleFormRenderer = memo(
  ({
    formComponentsByType: _formComponentsByType = {},
    formComponentsByFormType: _formComponentsByFormType = {},
    formComponentsByProperty: _formComponentsByProperty = {},
    formComponentsByCustomType: _formComponentsByCustomType = {},
    formComponentsByCustomControlType: _formComponentsByCustomControlType = {},
    formComponentsByLayoutName: _formComponentsByLayoutName = {},
    ...props
  }: FormFieldRendererProps & SimpleFormRendererProps) => {
    const formComponentsByType = useMemo(
      () => mergeWithObject(defaultFormComponentsByType, _formComponentsByType),
      [],
    );

    const formComponentsByFormType = useMemo(
      () =>
        mergeWithObject(
          defaultFormComponentsByFormType,
          _formComponentsByFormType,
        ),
      [],
    );

    const formComponentsByProperty = useMemo(
      () => mergeWithObject({}, _formComponentsByProperty),
      [],
    );

    const formComponentsByCustomType = useMemo(
      () => mergeWithObject({}, _formComponentsByCustomType),
      [],
    );

    const formComponentsByCustomControlType = useMemo(
      () => mergeWithObject({}, _formComponentsByCustomControlType),
      [],
    );

    const formComponentsByLayoutName = useMemo(
      () => mergeWithObject({}, _formComponentsByLayoutName),
      [],
    );

    return (
      <FormComponentSlots
        {...props}
        byType={formComponentsByType}
        byProperty={formComponentsByProperty}
        byCustomControlType={formComponentsByCustomControlType}
        byCustomType={formComponentsByCustomType}
        byFormType={formComponentsByFormType}
        byLayoutName={formComponentsByLayoutName}
      />
    );
  },
);

SimpleFormRenderer.displayName = "SimpleFormRenderer";
