import { JSONSchemaForm } from "../types/json_schema_form";
import {
  FormControllerContext,
  useFormControllerContext,
} from "../controller_context";
import {
  FormController,
  FormRendererProps,
  OutletRendererProps,
} from "../types/form";
import DefaultRenderer from "../renderers";
import { getProperty, setProperty } from "dot-prop";
import { produce } from "immer";
import { expandSectionSelector } from "../utils";
import { FC, useCallback, useMemo } from "react";

function FormRendererChild<
  RootSchemaType extends JSONSchemaForm,
  SchemaType extends JSONSchemaForm,
>({
  schema,
  parentProperty,
  property,
  preferFormTypeComponent = true,
  preferPropertyComponent = true,
  preferSchemaTypeComponent = true,
}: FormRendererProps<SchemaType>) {
  const {
    rootSchema,
    render: RenderComponent,
    getValue,
    setValue,
  } = useFormControllerContext<RootSchemaType, SchemaType>();

  const _FormRendererChild = useCallback<FC<OutletRendererProps>>(
    ({
      parentProperty: _parentProperty,
      property: _property,
      schema: _schema,
      preferFormTypeComponent,
      preferPropertyComponent,
      preferSchemaTypeComponent,
    }) => {
      return (
        <FormRendererChild
          schema={_schema ?? schema}
          parentProperty={_parentProperty ?? parentProperty}
          property={_property ?? property}
          // False by default to avoid infinite recursion. You must explicitly set it to true.
          preferFormTypeComponent={preferFormTypeComponent ?? false}
          preferPropertyComponent={preferPropertyComponent ?? false}
          preferSchemaTypeComponent={preferSchemaTypeComponent ?? false}
        />
      );
    },
    [schema, parentProperty, property],
  );

  if (typeof schema !== "object" || !("type" in schema)) {
    return null;
  }

  const fullProperty =
    parentProperty.length > 0
      ? property.startsWith("[")
        ? parentProperty + property
        : parentProperty + "." + property
      : property;

  return (
    <RenderComponent
      rootSchema={rootSchema}
      schema={schema}
      Outlet={_FormRendererChild}
      fullProperty={fullProperty}
      property={property}
      getValue={getValue}
      setValue={setValue}
      value={getValue(fullProperty)}
      onChange={(newValue) => setValue(fullProperty, newValue)}
      formProperties={schema.formProperties}
      componentPreference={{
        preferFormTypeComponent,
        preferPropertyComponent,
        preferSchemaTypeComponent,
      }}
    />
  );
}

export default function FormRenderer<SchemaType extends JSONSchemaForm, Value>({
  className,
  render,
  section,
  schema,
  value,
  onChange,
}: Omit<FormRendererProps<SchemaType>, "property" | "parentProperty"> & {
  section?: string;
  render?: FormController;
  value?: Value; // TODO: define a type for value
  onChange?: (value: Value) => void; // TODO: define a type for value
  className?: string;
}) {
  const _render = useCallback(render || DefaultRenderer, []);

  const expandedSectionSelector = useMemo(
    () => (section ? expandSectionSelector(schema, section) : undefined),
    [schema, section],
  );

  const selectedSchema = useMemo(
    () =>
      expandedSectionSelector
        ? getProperty(schema, expandedSectionSelector)!
        : schema,
    [schema, expandedSectionSelector],
  );

  const selectedValue = useMemo(
    () => (section ? getProperty(value, section)! : value),
    [value, section],
  );

  return (
    <FormControllerContext.Provider
      value={{
        rootSchema: selectedSchema,
        render: _render,
        getValue<T>(key: string) {
          if (typeof selectedValue !== "object") {
            if (key === "*") {
              return selectedValue as T;
            } else {
              return undefined;
            }
          }
          return getProperty(selectedValue, key);
        },
        setValue(key, newValue) {
          if (
            typeof selectedValue === "undefined" ||
            typeof value === "undefined"
          ) {
            console.error("Value is undefined");
            return;
          } else if (!selectedValue || !value) {
            console.error("Value is falsy", { value: selectedValue });
            return;
          }

          const prevValue =
            key === "*" ? selectedValue : getProperty(selectedValue, key);
          if (typeof prevValue !== typeof newValue) {
            console.error("New value has different type than the old value", {
              value,
              newValue,
            });
            return;
          } else if (typeof newValue === "undefined") {
            console.error("Value is undefined");
            return;
          } else if (
            prevValue === selectedValue &&
            typeof prevValue !== "object"
          ) {
            if (key !== "*") {
              console.error("Invalid key", key);
              return;
            }

            onChange?.(newValue as Value);
          } else if (key === "*") {
            console.error("Rewriting the whole value is not allowed");
            return;
          }

          onChange?.(
            produce(value, (draft) => {
              if (selectedValue !== value) {
                return setProperty(draft, section + "." + key, newValue);
              }
              return setProperty(draft, key, newValue);
            }),
          );
        },
      }}
    >
      <div className={className}>
        <FormRendererChild
          schema={selectedSchema}
          property=""
          parentProperty=""
          preferPropertyComponent
          preferFormTypeComponent
          preferSchemaTypeComponent
        />
      </div>
    </FormControllerContext.Provider>
  );
}
