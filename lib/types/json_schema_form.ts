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
//
// To add a section title and description, the schema
// associated with the section must have the following properties:
// - $sectionTitle (type: string, jsfType: JSFText): The title of the section
// - $sectionDescription (type: string, jsfType: JSFText): The description of the section
//
// The following properties must be added at the beginning of
// the object schema:
// {
//  "type": "object",
//  "properties": {
//    "$sectionTitle": {
//      "type": "string",
//      "formProperties": {
//        "type": "text",
//        "text": "Section Title"
//      }
//    },
//    "$sectionDescription": {
//      "type": "string",
//      "formProperties": {
//        "type": "text",
//        "text": "Section Description"
//      }
//    },
//    ... rest of the properties
//  },
// }
export interface JSFSection extends JSFBase {
  type: "section";
  layout?: JSFLayoutMeta;
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

// A content object that displays non-input elements
export type JSFContent = JSFImage | JSFVideo | JSFOembed | JSFText;

// An image object is an image element that can be displayed in a form
//
// JSON schema type required: object
//
// To add an image to a form, the schema associated with the image
// must have the following properties:
// - $src (type: string): The URL of the image
// - $alt (type: string): The alt text of the image
// - $caption (type: string): The caption of the image
// - $poster (type: string): The URL of the image poster
export interface JSFImage extends JSFBase {
  type: "image";
}

// A video object is a video element that can be displayed in a form
//
// JSON schema type required: object
//
// To add a video to a form, the schema associated with the video
// must have the following properties:
// - $src (type: string): The URL of the video
// - $poster (type: string): The URL of the video poster image
export interface JSFVideo extends JSFBase {
  type: "video";
}

// An oembed object is an oembed element that can be displayed in a form
//
// JSON schema type required: object
// To add an oembed element to a form, the schema associated with the oembed
// must have the following properties:
// - $url (type: string): The URL of the oembed content
export interface JSFOembed extends JSFBase {
  type: "oembed";
}

// A text object is a text element that can be displayed in a form
//
// JSON schema type required: string
export type JSFText = JSFPlainText | JSFRichText;

// A plain text object is a plain text element that can be displayed in a form.
// It is used for simple text elements that do not require any special formatting.
// Use JSFRichText for rich text elements that require special formatting.
//
// JSON schema type required: string
// To add plain text to a form, the schema associated with the plain text
// must have the following properties:
// - $content (type: string): The plain text content
export interface JSFPlainText extends JSFBase {
  type: "text";
}

// A rich text object is a rich text element that can be displayed in a form.
// It is used for rich text elements that require special formatting.
//
// JSON schema type required: string
// To add rich text to a form, the schema associated with the rich text
// must have the following properties:
// - $content (type: string): The rich text content
export interface JSFRichText extends JSFBase {
  type: "rich-text";
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
//
// To add the essential properties of a button control, the schema
// associated with the button control must have the following properties:
// - $buttonText (type: string, jsfType: JSFText): The text of the button
// - $buttonIcon (type: string, jsfType: JSFImage): The icon of the button
export interface JSFButtonControl extends JSFControlBase {
  type: "button";
  buttonType: "submit" | "reset" | "button";
  buttonVariant:
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "danger"
    | string;
  buttonSize: "small" | "medium" | "large" | string;
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

export type JSFSectionSchema = JSONSchemaObject<JSFFormProperty<JSFSection>> & {
  properties: {
    $sectionTitle: JSFTextSchema;
    $sectionDescription: JSFTextSchema;
  } & Record<string, JSONSchemaObject<JSFFormProperty>>;
};

export type JSFContentSchema =
  | JSFTextSchema
  | JSFImageSchema
  | JSFVideoSchema
  | JSFOembedSchema;

export type JSFTextSchema = JSONSchemaString<JSFFormProperty> &
  Required<JSFFormProperty<JSFText>>;

export type JSFImageSchema = JSONSchemaObject<JSFFormProperty> &
  Required<JSFFormProperty<JSFImage>> & {
    properties: {
      $src: JSONSchemaString<JSFFormProperty>;
      $alt: JSONSchemaString<JSFFormProperty>;
      $caption: JSONSchemaString<JSFFormProperty>;
      $poster: JSONSchemaString<JSFFormProperty>;
    } & Record<string, JSONSchemaObject<JSFFormProperty>>;
  };

export type JSFVideoSchema = JSONSchemaObject<JSFFormProperty> &
  Required<JSFFormProperty<JSFVideo>> & {
    properties: {
      $src: JSONSchemaString<JSFFormProperty>;
      $poster: JSONSchemaString<JSFFormProperty>;
    } & Record<string, JSONSchemaObject<JSFFormProperty>>;
  };

export type JSFOembedSchema = JSONSchemaObject<JSFFormProperty> &
  Required<JSFFormProperty<JSFOembed>> & {
    properties: {
      $url: JSONSchemaString<JSFFormProperty>;
    } & Record<string, JSONSchemaObject<JSFFormProperty>>;
  };

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
