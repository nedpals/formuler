import {
  FormComponentsByFormTypeMap,
  FormComponentsByTypeMap,
} from "../components/FormComponentSlots";

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
