import { FormTypeController } from "../../types/form";

const Oembed: FormTypeController<"oembed"> = ({
  formProperties,
  schema,
  property,
}) => {
  const { url } = formProperties;
  return (
    <div
      className={`oembed ${property.length > 0 ? "property-" + property : ""} oembed-${schema.type}`}
    >
      TODO: Oembed ({url})
    </div>
  );
};

export default Oembed;
