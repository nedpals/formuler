import { FormFieldRenderer, FormTypeFieldRenderer } from "../types/form";
import { JSONSchema, JSONSchemaMultiTypeKeys } from "../types/json_schema";
import { JSFType, JSONSchemaForm } from "../types/json_schema_form";
import {
  ArrayRender,
  Image as _Image,
  Input,
  ObjectRender,
  RichText,
  Section,
  Text,
  Video,
  Layout,
  Oembed,
} from "./components";

export type FormComponentsByFormTypeMap = {
  [K in JSFType]?: FormTypeFieldRenderer<K>;
};

export type FormComponentsByTypeMap = {
  [K in Exclude<
    JSONSchemaForm["type"],
    JSONSchemaMultiTypeKeys
  >]?: FormFieldRenderer<JSONSchemaForm, Extract<JSONSchema, { type: K }>>;
};

export const defaultFormComponentsByType: FormComponentsByTypeMap = {
  string: Input,
  boolean: Input,
  number: Input,
  integer: Input,
  null: () => null,
  array: ArrayRender,
  object: ObjectRender,
};

export const defaultFormComponentsByFormType: FormComponentsByFormTypeMap = {
  input: Input,
  section: Section,
  "rich-text": RichText,
  text: Text,
  image: _Image,
  video: Video,
  layout: Layout,
  oembed: Oembed,
};
