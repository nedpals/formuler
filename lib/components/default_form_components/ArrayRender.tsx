import { FormFieldRenderer } from "../../types/form";
import { JSONSchemaArray } from "../../types/json_schema";
import { JSONSchemaForm } from "../../types/json_schema_form";

const ArrayRender: FormFieldRenderer<JSONSchemaForm, JSONSchemaArray> = ({
  Outlet,
  schema,
  fullProperty,
}) => {
  if (!schema.items || !Array.isArray(schema.items)) {
    return null;
  }

  return (
    <>
      {schema.items
        .filter((it) => typeof it === "object")
        .map((item, index) => (
          <Outlet
            key={`property_${fullProperty}[${index}]`}
            schema={item}
            parentProperty={fullProperty}
            property={`[${index}]`}
            preferFormTypeComponent
            preferPropertyComponent
            preferSchemaTypeComponent
          />
        ))}
    </>
  );
};

export default ArrayRender;
