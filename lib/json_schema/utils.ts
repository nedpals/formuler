import { JSONSchema } from "./types";

//@ts-expect-error we may return any type derived from JSONSchema
export function createDataFromSchema(schema: JSONSchema) {
  if (typeof schema !== "object") {
    return {};
  }

  switch (schema.type) {
    case "object": {
      if (!schema.properties) {
        return {};
      }

      const data: Record<string, unknown> = {};
      for (const [key, childSchema] of Object.entries(schema.properties)) {
        data[key] = createDataFromSchema(childSchema);
      }

      return data;
    }
    case "array": {
      if (!schema.items) {
        return [];
      } else if (Array.isArray(schema.items)) {
        return schema.items.map(createDataFromSchema);
      } else {
        return [createDataFromSchema(schema.items)];
      }
    }
    case "boolean": {
      return false;
    }
    case "null": {
      return null;
    }
    case "string": {
      return schema.default ?? "";
    }
    case "number":
    case "integer": {
      return schema.default ?? 0;
    }
    default: {
      return schema.default ?? null;
    }
  }
}

export function parseSelector(selector: string) {
  return selector.split(".").flatMap((part) => {
    // if part contains an array notation, split it
    if (part.includes("[")) {
      const [key, index] = part.split("[");
      return [key, parseInt(index.slice(0, -1))];
    }
    return part;
  });
}

export function expandSectionSelector<S extends JSONSchema>(
  schema: S,
  sectionSelector: string,
) {
  if (typeof schema !== "object") {
    return "";
  }

  const parts = parseSelector(sectionSelector);
  const expandedSelectorParts: (string | number)[] = [];

  let currentSchema: JSONSchema = schema;

  for (const part of parts) {
    if (typeof currentSchema !== "object") {
      break;
    }

    let newCurrentSchema: JSONSchema = currentSchema;
    const newSelectorParts: (string | number)[] = [];

    if (currentSchema.type === "object") {
      if (
        !currentSchema.properties ||
        !currentSchema.properties[part] ||
        typeof currentSchema.properties[part] !== "object"
      ) {
        break;
      }

      newCurrentSchema = currentSchema.properties[part];
      newSelectorParts.push("properties", part);
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
      newSelectorParts.push("items", `[${part}]`);
    } else {
      // Return the current schema if it's not an object or an array
      break;
    }

    // Set the new schema as the current schema
    currentSchema = newCurrentSchema;
    expandedSelectorParts.push(...newSelectorParts);
  }

  return expandedSelectorParts.join(".");
}
