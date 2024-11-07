import { FormTypeController } from "../../types/form";

export const Text: FormTypeController<"text"> = ({
  formProperties,
  schema,
  property,
}) => {
  return (
    <p
      className={`text text-plain-text ${property.length > 0 ? "property-" + property : ""} text-${schema.type}`}
    >
      {formProperties.content}
    </p>
  );
};

export const RichText: FormTypeController<"rich-text"> = ({
  formProperties,
  schema,
  property,
}) => {
  return (
    <div
      className={`text text-rich-text ${property.length > 0 ? "property-" + property : ""} text-${schema.type}`}
      dangerouslySetInnerHTML={{ __html: formProperties.content }}
    ></div>
  );
};
