import { produce } from "immer";
import { JSONSchemaForm } from "./types/json_schema_form";

export function mergeWithObject<V>(
  obj1: Record<string, V>,
  obj2: Record<string, V>,
) {
  return produce(obj1, (draft) => {
    for (const key in obj2) {
      if (!Object.prototype.hasOwnProperty.call(draft, key)) {
        // @ts-expect-error - we are adding a new key to the object
        draft[key] = obj2[key];
      } else if (
        typeof draft[key] === "object" &&
        typeof obj2[key] === "object"
      ) {
        //@ts-expect-error - we are using recursion to merge objects
        draft[key] = mergeWithObject(draft[key], obj2[key]);
      } else {
        // @ts-expect-error - we are overwriting the key
        draft[key] = obj2[key];
      }
    }
  });
}

function parseSelector(selector: string) {
  return selector.split(".").flatMap((part) => {
    // if part contains an array notation, split it
    if (part.includes("[")) {
      const [key, index] = part.split("[");
      return [key, parseInt(index.slice(0, -1))];
    }
    return part;
  });
}

export function goToSchemaSection<S extends JSONSchemaForm>(
  schema: S,
  sectionSelector: string,
) {
  if (typeof schema !== "object") {
    return schema;
  }

  const parts = parseSelector(sectionSelector);

  // When returned, it will return the last "valid" schema
  let currentSchema: JSONSchemaForm = schema;

  for (const part of parts) {
    let newCurrentSchema = currentSchema;

    if (currentSchema.type === "object") {
      if (
        !currentSchema.properties ||
        !currentSchema.properties[part] ||
        typeof currentSchema.properties[part] !== "object"
      ) {
        break;
      }

      newCurrentSchema = currentSchema.properties[part];
    } else if (currentSchema.type === "array") {
      if (
        !currentSchema.items ||
        !Array.isArray(currentSchema.items) ||
        typeof part !== "number" ||
        typeof currentSchema.items[part] !== "object"
      ) {
        break;
      }

      newCurrentSchema = currentSchema.items[part];
    } else {
      // Return the current schema if it's not an object or an array
      break;
    }

    // Additional check to see if the new schema is a section
    if (
      !newCurrentSchema.formProperties ||
      newCurrentSchema.formProperties.type !== "section"
    ) {
      break;
    }

    // Set the new schema as the current schema
    currentSchema = newCurrentSchema;
  }
  return currentSchema;
}
