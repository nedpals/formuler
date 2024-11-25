import { getProperty } from "dot-prop";
import { FC, Fragment, memo, useCallback, useMemo } from "react";
import { JSONSchemaForm } from "../jsf";
import { expandSectionSelector } from "../json_schema";
import { FormRenderContext, useFormRenderContext } from "../render_context";
import {
  FormFieldRenderer,
  FormRendererProps,
  OutletRendererProps,
} from "../form_types";

const FormRendererChild = <
  RootSchemaType extends JSONSchemaForm,
  SchemaType extends JSONSchemaForm,
>({
  schema,
  parentProperty,
  property,
  preferFormTypeComponent = true,
  preferPropertyComponent = true,
  preferSchemaTypeComponent = true,
}: FormRendererProps<SchemaType>) => {
  const { rootSchema, render: RenderComponent } =
    useFormRenderContext<RootSchemaType>();
  const _FormRendererChild = useCallback<FC<OutletRendererProps>>(
    ({
      parentProperty: _parentProperty,
      property: _property,
      schema: _schema,
      preferFormTypeComponent,
      preferPropertyComponent,
      preferSchemaTypeComponent,
    }) => (
      <FormRendererChild
        schema={_schema ?? schema}
        parentProperty={_parentProperty ?? parentProperty}
        property={_property ?? property}
        // False by default to avoid infinite recursion. You must explicitly set it to true.
        preferFormTypeComponent={preferFormTypeComponent ?? false}
        preferPropertyComponent={preferPropertyComponent ?? false}
        preferSchemaTypeComponent={preferSchemaTypeComponent ?? false}
      />
    ),
    [schema, parentProperty, property],
  );

  const fullProperty =
    parentProperty.length > 0
      ? property.startsWith("[")
        ? parentProperty + property
        : parentProperty + "." + property
      : property;

  const preference = useMemo(
    () => ({
      preferFormTypeComponent,
      preferPropertyComponent,
      preferSchemaTypeComponent,
    }),
    [
      preferFormTypeComponent,
      preferPropertyComponent,
      preferSchemaTypeComponent,
    ],
  );

  if (typeof schema !== "object" || !("type" in schema)) {
    return null;
  }

  return (
    <Fragment>
      {RenderComponent({
        rootSchema: rootSchema,
        schema: schema,
        Outlet: _FormRendererChild,
        fullProperty: fullProperty,
        property: property,
        formProperties: schema.formProperties,
        preference: preference,
      })}
    </Fragment>
  );
};
FormRendererChild.displayName = "FormRendererChild";

const FormRenderer = memo(
  <SchemaType extends JSONSchemaForm>({
    className,
    render,
    section,
    schema,
  }: Omit<FormRendererProps<SchemaType>, "property" | "parentProperty"> & {
    section?: string;
    render: FormFieldRenderer;
    className?: string;
  }) => {
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
      <div className={className}>
        <FormRenderContext rootSchema={selectedSchema} render={render}>
          <FormRendererChild
            schema={selectedSchema}
            property={section ?? ""}
            parentProperty=""
            preferPropertyComponent
            preferFormTypeComponent
            preferSchemaTypeComponent
          />
        </FormRenderContext>
      </div>
    );
  },
);

FormRenderer.displayName = "FormRenderer";

export default FormRenderer;
