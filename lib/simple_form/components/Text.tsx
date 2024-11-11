import { FormTypeFieldRenderer } from "../../form_types";

export const Text: FormTypeFieldRenderer<"text"> = ({
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

export const RichText: FormTypeFieldRenderer<"rich-text"> = ({
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
