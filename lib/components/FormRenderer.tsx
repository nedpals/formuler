import { JSONSchemaForm } from "../types/json_schema_form";
import {
  FormControllerContext,
  useFormControllerContext,
} from "../controller_context";
import { FormController, FormRendererProps } from "../types/form";
import DefaultRenderer from "../renderers";
import { getProperty, setProperty } from "dot-prop";
import { produce } from "immer";
import { expandSectionSelector } from "../utils";
import { useMemo } from "react";

function FormRendererChild<
  RootSchemaType extends JSONSchemaForm,
  SchemaType extends JSONSchemaForm,
>({ schema, parentProperty, property }: FormRendererProps<SchemaType>) {
  const { rootSchema, render, getValue, setValue } =
    useFormControllerContext<RootSchemaType>();

  if (typeof schema !== "object" || !("type" in schema)) {
    return null;
  }

  const fullProperty =
    parentProperty.length > 0
      ? property.startsWith("[")
        ? parentProperty + property
        : parentProperty + "." + property
      : property;

  switch (schema.type) {
    case "object": {
      const properties = schema.properties;
      if (typeof properties !== "object") {
        return null;
      }

      return (
        <>
          {Object.keys(properties)
            .filter((k) => typeof properties[k] === "object")
            .map((key) => (
              <FormRendererChild
                key={key}
                schema={properties[key] as JSONSchemaForm}
                parentProperty={fullProperty}
                property={key}
              />
            ))}
        </>
      );
    }
    case "array": {
      if (!schema.items || !Array.isArray(schema.items)) {
        return null;
      }

      return (
        <>
          {schema.items
            .filter((it) => typeof it === "object")
            .map((item, index) => (
              <FormRendererChild
                key={index}
                schema={item}
                parentProperty={fullProperty}
                property={`[${index}]`}
              />
            ))}
        </>
      );
    }
    default: {
      const RenderComponent = render;
      return (
        <RenderComponent
          rootSchema={rootSchema}
          schema={schema}
          Outlet={FormRendererChild}
          fullProperty={fullProperty}
          property={property}
          getValue={getValue}
          setValue={setValue}
          value={getValue(fullProperty)}
          onChange={(newValue) => setValue(fullProperty, newValue)}
          formProperties={schema.formProperties}
        />
      );
    }
  }
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
  const _render = render || DefaultRenderer;
  const expandedSectionSelector = useMemo(
    () => (section ? expandSectionSelector(schema, section) : undefined),
    [schema, section],
  );
  const selectedSchema = useMemo(
    () =>
      expandedSectionSelector
        ? getProperty(
            schema,
            expandSectionSelector(schema, expandedSectionSelector),
          )!
        : schema,
    [schema, expandedSectionSelector],
  );

  return (
    <FormControllerContext.Provider
      value={{
        rootSchema: selectedSchema,
        render: _render,
        getValue<T>(key: string) {
          if (typeof value !== "object") {
            if (key === "*") {
              return value as T;
            } else {
              return undefined;
            }
          }
          return getProperty(value, key);
        },
        setValue(key, newValue) {
          if (typeof value === "undefined") {
            console.error("Value is undefined");
            return;
          } else if (!value) {
            console.error("Value is falsy", { value });
            return;
          }

          const prevValue = key === "*" ? value : getProperty(value, key);
          if (typeof prevValue !== typeof newValue) {
            console.error("New value has different type than the old value", {
              value,
              newValue,
            });
            return;
          } else if (typeof newValue === "undefined") {
            console.error("Value is undefined");
            return;
          } else if (prevValue === value && typeof prevValue !== "object") {
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
              if (section) {
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
        />
      </div>
    </FormControllerContext.Provider>
  );
}
