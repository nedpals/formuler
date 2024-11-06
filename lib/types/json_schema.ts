// This is a custom JSON schema type definition that supports custom properties

// Base interface for custom properties
export type ExtensionProperties = Record<string, unknown>;

// Common properties for all schema types
type JSONSchemaBase<Properties extends object = ExtensionProperties> = {
  $id?: string;
  $schema?: string;
  $ref?: string;
  $defs?: { [key: string]: JSONSchema<Properties> };
  title?: string;
  description?: string;
  deprecated?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  examples?: unknown[];

  // Conditional
  if?: JSONSchema<Properties>;
  then?: JSONSchema<Properties>;
  else?: JSONSchema<Properties>;

  // Combiners
  allOf?: JSONSchema<Properties>[];
  anyOf?: JSONSchema<Properties>[];
  oneOf?: JSONSchema<Properties>[];
  not?: JSONSchema<Properties>;
} & Properties;

export type JSONSchemaString<Properties extends object = ExtensionProperties> =
  JSONSchemaBase<Properties> & {
    type: "string";
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    format?: StringFormat;
    contentMediaType?: string;
    contentEncoding?: string;
    enum?: string[];
    const?: string;
    default?: string;
  };

export type JSONSchemaNumber<Properties extends object = ExtensionProperties> =
  JSONSchemaBase<Properties> & {
    type: "number";
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    minimum?: number;
    exclusiveMinimum?: number;
    format?: NumberFormat;
    enum?: number[];
    const?: number;
    default?: number;
  };

export type JSONSchemaArray<Properties extends object = ExtensionProperties> =
  JSONSchemaBase<Properties> & {
    type: "array";
    items?: JSONSchema<Properties> | JSONSchema<Properties>[];
    additionalItems?: JSONSchema<Properties>;
    contains?: JSONSchema<Properties>;
    minContains?: number;
    maxContains?: number;
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
    enum?: unknown[][];
    const?: unknown[];
    default?: unknown[];
  };

export type JSONSchemaObject<Properties extends object = ExtensionProperties> =
  JSONSchemaBase<Properties> & {
    type: "object";
    properties?: { [key: string]: JSONSchema<Properties> };
    required?: string[];
    additionalProperties?: JSONSchema<Properties> | boolean;
    patternProperties?: { [key: string]: JSONSchema<Properties> };
    propertyNames?: JSONSchema<Properties>;
    minProperties?: number;
    maxProperties?: number;
    dependentRequired?: { [key: string]: string[] };
    dependentSchemas?: { [key: string]: JSONSchema<Properties> };
    enum?: object[];
    const?: object;
    default?: { [key: string]: unknown };
  };

export type JSONSchemaBoolean<Properties extends object = ExtensionProperties> =
  JSONSchemaBase<Properties> & {
    type: "boolean";
    enum?: boolean[];
    const?: boolean;
    default?: boolean;
  };

export type JSONSchemaNull<Properties extends object = ExtensionProperties> =
  JSONSchemaBase<Properties> & {
    type: "null";
    enum?: null[];
    const?: null;
    default?: null;
  };

export type JSONSchemaMultiTypeKeys = Array<
  "string" | "number" | "integer" | "boolean" | "object" | "array" | "null"
>;

export type JSONSchemaMultiType<
  Properties extends object = ExtensionProperties,
> = JSONSchemaBase<Properties> & {
  type: JSONSchemaMultiTypeKeys;
  enum?: unknown[];
  const?: unknown;
  default?: unknown;
};

export type StringFormat =
  | "date-time"
  | "date"
  | "time"
  | "duration"
  | "email"
  | "idn-email"
  | "hostname"
  | "idn-hostname"
  | "ipv4"
  | "ipv6"
  | "uri"
  | "uri-reference"
  | "iri"
  | "iri-reference"
  | "uuid"
  | "uri-template"
  | "json-pointer"
  | "relative-json-pointer"
  | "regex";

export type NumberFormat = "float" | "double";

// Main schema type that preserves the generic parameter
export type JSONSchema<Properties extends object = ExtensionProperties> =
  | JSONSchemaString<Properties>
  | JSONSchemaNumber<Properties>
  | JSONSchemaArray<Properties>
  | JSONSchemaObject<Properties>
  | JSONSchemaBoolean<Properties>
  | JSONSchemaNull<Properties>
  | JSONSchemaMultiType<Properties>
  | boolean;

// Helper type for references that preserves the generic parameter
export type JSONSchemaReference<
  Properties extends object = ExtensionProperties,
> = {
  $ref: string;
} & Properties;

export type JSONSchemaOrReference<
  Properties extends object = ExtensionProperties,
> = JSONSchema<Properties> | JSONSchemaReference<Properties>;
