import { memo, useMemo } from "react";
import {
  FormFieldRenderer,
  FormFieldRendererProps,
  FormTypeCustomControlFieldRenderer,
  FormTypeCustomFieldRenderer,
  FormTypeFieldRenderer,
} from "../form_types";
import { JSONSchema, JSONSchemaMultiTypeKeys } from "../json_schema";
import { JSFType, JSONSchemaForm } from "../jsf";

export type FormComponentsByFormTypeMap = {
  [K in JSFType]?: FormTypeFieldRenderer<K>;
};

export type FormComponentsByTypeMap = {
  [K in Exclude<
    JSONSchemaForm["type"],
    JSONSchemaMultiTypeKeys
  >]?: FormFieldRenderer<JSONSchemaForm, Extract<JSONSchema, { type: K }>>;
};

export interface FormComponentSlotProps {
  byType?: FormComponentsByTypeMap;
  byFormType?: FormComponentsByFormTypeMap;
  byProperty?: Record<string, FormFieldRenderer>; // TODO: make it type safe. property refers to either the full property or the property
  byCustomType?: Record<string, FormTypeCustomFieldRenderer>;
  byCustomControlType?: Record<string, FormTypeCustomControlFieldRenderer>;
  byLayoutName?: Record<string, FormTypeFieldRenderer<"layout">>;
}

const FormComponentSlots = memo(
  ({
    byType: _byType = {},
    byFormType: _byFormType = {},
    byProperty: _byProperty = {},
    byCustomType: _byCustomType = {},
    byCustomControlType: _byCustomControlType = {},
    byLayoutName: _byLayoutName = {},
    ...props
  }: FormFieldRendererProps & FormComponentSlotProps) => {
    const {
      preferFormTypeComponent,
      preferPropertyComponent,
      preferSchemaTypeComponent,
    } = props.preference;

    // Memoize all components
    const byType = useMemo(() => _byType, [_byType]);
    const byFormType = useMemo(() => _byFormType, [_byFormType]);
    const byProperty = useMemo(() => _byProperty, [_byProperty]);
    const byCustomType = useMemo(() => _byCustomType, [_byCustomType]);
    const byCustomControlType = useMemo(
      () => _byCustomControlType,
      [_byCustomControlType],
    );
    const byLayoutName = useMemo(() => _byLayoutName, [_byLayoutName]);

    // Hierarchical order of precedence for component lookup:
    // 1. formComponentsByProperty
    // 2. formComponentsByFormType
    //    2.1. by custom / custom control
    //    2.2. by layout name
    // 3. formComponentsByType
    if (
      preferPropertyComponent &&
      byProperty &&
      props.property &&
      byProperty[props.property]
    ) {
      const FormComponent = byProperty[props.property];
      return <FormComponent {...props} />;
    } else if (
      preferFormTypeComponent &&
      byFormType &&
      props.formProperties &&
      props.formProperties.type
    ) {
      const formType = props.formProperties.type;

      if (formType === "custom") {
        const customType = props.formProperties.customContentType;
        if (byCustomType[customType]) {
          const FormComponent = byCustomType[customType] as FormFieldRenderer;
          return <FormComponent {...props} />;
        }
      } else if (formType === "custom-control") {
        const controlType = props.formProperties.controlType;
        if (byCustomControlType[controlType]) {
          const FormComponent = byCustomControlType[
            controlType
          ] as FormFieldRenderer;
          return <FormComponent {...props} />;
        }
      } else if (
        formType === "layout" &&
        props.formProperties.name &&
        byLayoutName[props.formProperties.name]
      ) {
        const FormComponent = byLayoutName[
          props.formProperties.name
        ] as FormFieldRenderer;
        return <FormComponent {...props} />;
      } else if (byFormType[formType]) {
        const FormComponent = byFormType[formType] as FormFieldRenderer;
        return <FormComponent {...props} />;
      }
    } else if (preferSchemaTypeComponent) {
      const typesList = Array.isArray(props.schema.type)
        ? props.schema.type
        : [props.schema.type];

      for (const type of typesList) {
        if (byType[type]) {
          const FormComponent = byType[type] as FormFieldRenderer;
          return <FormComponent {...props} />;
        }
      }
    }

    // If no component is found, return nothing. Mark the field as hidden.
    return <></>;
  },
);

FormComponentSlots.displayName = "FormComponentSlots";

export default FormComponentSlots;
