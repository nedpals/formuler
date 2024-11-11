import { FormFieldRenderer } from "../../form_types";
import { JSONSchemaArray } from "../../json_schema";
import { JSONSchemaForm } from "../../jsf";

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
