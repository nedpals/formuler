import { FormTypeController } from "../../types/form";

const Section: FormTypeController<"section"> = ({
  schema,
  formProperties,
  Outlet,
  property,
}) => {
  const properties = schema.properties;
  if (typeof properties !== "object") {
    return <></>;
  }

  return (
    <div
      className={`section ${property.length > 0 ? "section-" + property : ""} ${property.length > 0 ? "property-" + property : ""} section-${schema.type}`}
    >
      <h2>{formProperties.title.content}</h2>
      <Outlet preferPropertyComponent preferSchemaTypeComponent />
    </div>
  );
};

export default Section;
