import { FormTypeFieldRenderer } from "../../form_types";
import { useSimpleFormController } from "../context";

// TODO: type-safety
const Button: FormTypeFieldRenderer<"button"> = ({
  formProperties,
  schema,
  fullProperty,
  property,
}) => {
  const { dispatch } = useSimpleFormController(fullProperty);

  return (
    <button
      className={`button button-${formProperties.buttonType ?? "button"} ${property.length > 0 ? "property-" + property : ""}  button-${schema.type}`}
      type={formProperties.buttonType ?? "button"}
      onClick={() => {
        dispatch("buttonClick", formProperties.action);
      }}
    >
      {/* TODO: icon */}
      {formProperties.text.content}
    </button>
  );
};

export default Button;
