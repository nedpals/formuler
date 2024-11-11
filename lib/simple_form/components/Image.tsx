import { FormTypeFieldRenderer } from "../../form_types";

const Image: FormTypeFieldRenderer<"image"> = ({
  formProperties,
  schema,
  property,
}) => {
  if (formProperties.poster || formProperties.caption) {
    return (
      <figure
        className={`image image-has-caption ${property.length > 0 ? "property-" + property : ""}  image-${schema.type}`}
      >
        <img src={formProperties.src} alt={formProperties.alt} />
        {formProperties.caption && (
          <figcaption>{formProperties.caption}</figcaption>
        )}

        {formProperties.poster && (
          <div>
            {formProperties.poster && (
              <figcaption>{formProperties.poster}</figcaption>
            )}
          </div>
        )}
      </figure>
    );
  }

  return (
    <img
      className={`image image-${schema.type}`}
      src={formProperties.src}
      alt={formProperties.alt}
    />
  );
};

export default Image;
