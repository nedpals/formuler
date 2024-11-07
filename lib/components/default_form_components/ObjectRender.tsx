import { JSONSchemaForm } from "../../types/json_schema_form";
import { JSONSchemaObject } from "../../types/json_schema";
import { FormController } from "../../types/form";

const ObjectRender: FormController<JSONSchemaForm, JSONSchemaObject> = ({
  schema,
  fullProperty,
  Outlet,
}) => {
  const properties = schema.properties;
  if (typeof properties !== "object") {
    return <></>;
  }

  return (
    <>
      {Object.keys(properties)
        .filter((k) => typeof properties[k] === "object")
        .map((key) => (
          <Outlet
            key={`property_${fullProperty}.${key}`}
            schema={properties[key] as JSONSchemaForm}
            parentProperty={fullProperty}
            property={key}
            preferFormTypeComponent
            preferPropertyComponent
            preferSchemaTypeComponent
          />
        ))}
    </>
  );
};

export default ObjectRender;
