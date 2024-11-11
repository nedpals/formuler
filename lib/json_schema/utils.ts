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
