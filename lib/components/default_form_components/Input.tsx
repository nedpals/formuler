import { FormControllerProps } from "../../types/form";

export default function Input({
  value,
  onChange,
  formProperties,
  schema,
}: FormControllerProps) {
  const inputType =
    formProperties?.type === "input" ? formProperties.inputType : "text";

  if (inputType === "checkbox") {
    return (
      <input
        type="checkbox"
        checked={value as boolean}
        onChange={(e) => onChange(e.target.checked)}
      />
    );
  }

  return (
    <input
      type={inputType}
      value={typeof value === "string" ? value : `${value}`}
      minLength={schema.type === "string" ? schema.minLength : undefined}
      maxLength={schema.type === "string" ? schema.maxLength : undefined}
      min={schema.type === "number" ? schema.minimum : undefined}
      max={schema.type === "number" ? schema.maximum : undefined}
      step={schema.type === "number" ? schema.multipleOf : undefined}
      placeholder={
        formProperties?.type === "input"
          ? formProperties.placeholder
          : undefined
      }
      onChange={(ev) => onChange(ev.target.value)}
    />
  );
}
