import { JSONSchema, JSONSchemaObject, JSONSchemaString } from "./json_schema";

// The JSON Schema Form (JSF) is a JSON object that describes the structure of a form.
export type JSONSchemaFormElement =
  | JSFSection
  | JSFLayout
  | JSFContent
  | JSFControl
  | JSFCustom;

// Base interface for all JSF objects
export interface JSFBase {
  className?: string;
  layoutSettings?: JSFLayoutSettings;
}

// A section is a container for other JSF objects
//
// JSON schema type required: object
export interface JSFSection extends JSFBase {
  type: "section";
  layout?: JSFLayoutMeta;
  title: JSFText;
  description: JSFText;
}

// A layout is a container for other JSF objects
//
// JSON schema type required: object
export interface JSFLayout extends JSFLayoutMeta {
  type: "layout";
}

// A layout meta object describes the layout of a layout or section
export interface JSFLayoutMeta extends JSFBase {
  name: "row" | "col" | string;
}

// A layout settings object describes the layout settings of a layout or section
export interface JSFLayoutSettings {
  width?: number;
  height?: number;
}

// A content object that displays non-input elements.
//
// JSON schema type required: object
// Properties: {}
export type JSFContent = JSFImage | JSFVideo | JSFOembed | JSFText;

// An image object is an image element that can be displayed in a form
//
// See JSFContent for more information
export interface JSFImage extends JSFBase {
  type: "image";
  src: string;
  alt?: string; // The alt text of the image
  caption?: string; // The caption of the image
  poster?: string; // The URL of the image poster
}

// A video object is a video element that can be displayed in a form
//
// See JSFContent for more information
export interface JSFVideo extends JSFBase {
  type: "video";
  src: string; // The URL of the video
  poster?: string; // The URL of the video poster
}

// An oembed object is an oembed element that can be displayed in a form
//
// See JSFContent for more information
export interface JSFOembed extends JSFBase {
  type: "oembed";
  url: string; // The URL of the oembed content
}

// A text object is a text element that can be displayed in a form
//
// See JSFContent for more information
export type JSFText = JSFPlainText | JSFRichText;

// A plain text object is a plain text element that can be displayed in a form.
// It is used for simple text elements that do not require any special formatting.
// Use JSFRichText for rich text elements that require special formatting.
//
// See JSFContent for more information
export interface JSFPlainText extends JSFBase {
  type: "text";
  content: string;
}

// A rich text object is a rich text element that can be displayed in a form.
// It is used for rich text elements that require special formatting.
//
// See JSFContent for more information
export interface JSFRichText extends JSFBase {
  type: "rich-text";
  content: string;
}

// An input control is a form input element
export type JSFControl = JSFInputControl | JSFButtonControl | JSFCustomControl;

// A control is a form input element
//
// JSON schema type required: any
export interface JSFControlBase extends JSFBase {
  type: string;
  label?: string;
  hintText?: string;
}

// An input control is a form input element
export interface JSFInputControl extends JSFControlBase {
  type: "input";
  inputType:
    | "text"
    | "number"
    | "email"
    | "password"
    | "textarea"
    | "checkbox"
    | "radio"
    | "select"
    | "date"
    | "time"
    | "datetime-local"
    | "file"
    | "hidden";
  placeholder?: string;
}

// A button control is a form button element
//
// JSON schema type required: object
export interface JSFButtonControl extends JSFControlBase {
  type: "button";
  buttonType: "submit" | "reset" | "button";
  text: JSFText;
  icon: JSFImage;
  variant:
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "danger"
    | string;
  size: "small" | "medium" | "large" | string;
  action: JSFButtonAction;
}

// A button action is an action that a button control can perform
// when clicked by the user. The action can be a section redirect,
// a URL redirect, or a custom action.
export type JSFButtonAction =
  | {
      type: "section-redirect";
      sectionId: "$prev" | "$next" | string; // section name property
    }
  | {
      type: "url-redirect";
      url: string;
    }
  | {
      type: "custom-action";
      action: string;
      payload: Record<string, unknown>;
    };

// A custom control is a custom form input element
//
// JSON schema type required: any
export interface JSFCustomControl extends JSFControlBase {
  type: "custom-control";
  controlType: string;
}

// A custom object is a custom form element that can be displayed in a form
//
// JSON schema type required: any
export interface JSFCustom extends JSFBase {
  type: "custom";
  customContentType: string;
  properties: Record<string, unknown>;
}

/// Custom type-safe JSON Schema types for JSF objects

export type JSFFormProperty<
  JSFObject extends JSONSchemaFormElement = JSONSchemaFormElement,
> = {
  formProperties?: JSFObject;
};

export type JSFSectionSchema = JSONSchemaObject<JSFFormProperty<JSFSection>>;

export type JSFContentSchema =
  | JSFTextSchema
  | JSFImageSchema
  | JSFVideoSchema
  | JSFOembedSchema;

export type JSFTextSchema = JSONSchemaString<JSFFormProperty> &
  Required<JSFFormProperty<JSFText>>;

export type JSFImageSchema = JSONSchemaObject<JSFFormProperty> &
  Required<JSFFormProperty<JSFImage>>;

export type JSFVideoSchema = JSONSchemaObject<JSFFormProperty> &
  Required<JSFFormProperty<JSFVideo>>;

export type JSFOembedSchema = JSONSchemaObject<JSFFormProperty> &
  Required<JSFFormProperty<JSFOembed>>;

export type JSFInputControlSchema = Exclude<
  JSONSchema<JSFFormProperty>,
  boolean
> &
  Required<JSFFormProperty<JSFInputControl>>;

export type JSFButtonControlSchema = JSONSchemaObject &
  Required<JSFFormProperty<JSFButtonControl>>;

export type JSFCustomControlSchema = JSONSchemaObject<JSFFormProperty> &
  Required<JSFFormProperty<JSFCustomControl>>;

export type JSFControlSchema =
  | JSFInputControlSchema
  | JSFButtonControlSchema
  | JSFCustomControlSchema;

// JSONSchemaForm is an extension of JSONSchema that allows for
// the definition of form elements.
//
// Not all properties are required to have form element properties.
// Thus, they are classified as "hidden" properties.
//
// To define a form element, the schema must have an object property called
// "formProperties" that contains the form element properties.
export type JSONSchemaForm =
  | JSFSectionSchema
  | JSFContentSchema
  | JSFControlSchema
  | Exclude<JSONSchema<JSFFormProperty>, boolean>;
