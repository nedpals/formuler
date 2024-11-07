import { FormTypeController } from "../../types/form";

const Layout: FormTypeController<"layout"> = ({
  schema,
  formProperties,
  Outlet,
  property,
}) => {
  return (
    <div
      className={`layout layout-${formProperties.name} ${property.length > 0 ? "property-" + property : ""} layout-${schema.type}`}
    >
      <Outlet preferPropertyComponent preferSchemaTypeComponent />
    </div>
  );
};

export default Layout;
