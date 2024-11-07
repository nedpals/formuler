import { FormTypeController } from "../../types/form";

const Video: FormTypeController<"video"> = ({
  formProperties,
  schema,
  property,
}) => {
  return (
    <video
      src={formProperties.src}
      poster={formProperties.poster}
      controls
      width="100%"
      height="auto"
      className={`video ${property.length > 0 ? "property-" + property : ""} video-${schema.type}`}
    />
  );
};

export default Video;
