import { JSONSchemaForm } from "../types/json_schema_form";
import { FormRenderContext, useFormRenderContext } from "../render_context";
import {
  FormFieldRenderer,
  FormRendererProps,
  OutletRendererProps,
} from "../types/form";
import { getProperty } from "dot-prop";
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
  const { rootSchema, render: RenderComponent } = useFormRenderContext<
    RootSchemaType,
    SchemaType
  >();

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
      formProperties={schema.formProperties}
      preference={{
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
}: Omit<FormRendererProps<SchemaType>, "property" | "parentProperty"> & {
  section?: string;
  render: FormFieldRenderer;
  value?: Value; // TODO: define a type for value
  onChange?: (value: Value) => void; // TODO: define a type for value
  className?: string;
}) {
  const _render = useCallback(render, []);

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

  return (
    <FormRenderContext.Provider
      value={{
        rootSchema: selectedSchema,
        render: _render,
      }}
    >
      <div className={className}>
        <FormRendererChild
          schema={selectedSchema}
          property=""
          parentProperty={section ?? ""}
          preferPropertyComponent
          preferFormTypeComponent
          preferSchemaTypeComponent
        />
      </div>
    </FormRenderContext.Provider>
  );
}
