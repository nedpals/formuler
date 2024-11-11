# Formuler 📝

A form renderer built for React. Create scalable, complex forms at less effort with the power of JSON Schema.

## Features
- **Dynamic Form Rendering**: It uses JSON schema to define and render forms. Fetch the schema from the server or define it locally.
- **Great Customizability**: Customize Form behavior with JSON Schema Form, style our default UI components, or use your favorite UI libraries directly.
- **Compatible with Existing Libraries**: Use it with your favorite form libraries like Formik, react-hook-form, or react-jsonschema-form.
- **Type-Safe**: Build type-safe forms easily with TypeScript. (WIP)

## Perfect for...
- Simple forms
- Complex, multi-layout forms
- Multi-step / wizard forms
- Remote web forms

## Installation
```bash
npm install formuler
```

## Quickstart
```jsx
import React from 'react';
import { FormRenderer } from 'formuler';
import { SimpleForm, SimpleFormRenderer } from 'formuler/simple_form';

export default function App() {
  // 1. Define your form's schema or fetch it remotely
  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Name',
        formProperties: {
          type: 'input',
          inputType: 'text',
          placeholder: 'Enter your name',
        }
      },
      age: {
        type: 'number',
        title: 'Age',
        formProperties: {
          type: 'input',
          inputType: 'number',
          placeholder: 'Enter your age',
        }
      },
    },
  };

  // 2. Provide a value and a function to update the value.
  // In this case, we will use `useState` and `SimpleForm` from `simple_form` subpackage
  // (you can use your own form/state management library!)
  const [value, setValue] = React.useState({
    name: 'Bob',
    age: 18,
  });

  // 3. Render your form using FormRenderer
  return (
    <SimpleForm value={value} onChange={setValue}>
      <FormRenderer
        schema={schema}
        render={SimpleFormRenderer} />
    </SimpleForm>
  );
}
```

## Usage
### Extend/Override Default Components
Formuler's built-in `simple_form` package provides default components for rendering forms.
You can extend or override them to fit your needs by overriding the simple_form's `SimpleFormRenderer` component.
You may override at various levels: schema type-level, form type level, property-level, and layout-level.

```jsx
<FormRenderer
  schema={schema}
  render={(props) => (
    <SimpleFormRenderer
      {...props}
      byType={{
        string: ({ formProperties }) => <p className="text-xl">{formProperties.content}</p>,
      }}
      byFormType={{
        input: (props) => (
          <div>
            <p style={{ marginBottom: 0 }}>
              {props.formProperties.label}
            </p>
            <Input {...props} />
          </div>
        ),
      }} />
  )} />
```

### Using Third Party Components and Form/State Management
While Formuler provides its own built-in set of components for rendering forms, you may use your own as well directly
without the need for a separate "adapter" package. Simply replace the render function with your favorite UI library components.

The same goes as well with form/state management libraries. Formuler does not provide an opinionated way of updating and setting
form values and they are delegated instead to form libraries such as Formik and react-hook-form. You can use them inside your
custom components or in conjunction with `SimpleForm` component (when using the default components).

### ShadCN + react-hook-forms example
```jsx
function default App() {
  // ...

  return (
    <Form {...form}>
      <FormRenderer
        schema={schema}
        value={value}
        onChange={setValue}
        render={({ fullProperty }) => (
          <FormField
            control={form.control}
            name={fullProperty}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test</FormLabel>
                <FormControl>
                  <Outlet {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
        )}
      />
    </Form>
  );
}
```

### Wizard Form through the `section` prop

You can extract or render only a section of your form's schema through the `section` prop.
This is perfect when you are building multi-step or wizard-like forms.

In this example, we have two sections: `personal_information` and `contact_information`.

```jsonc
{
  "type": "object",
  "properties": {
    "personal_information": {
      "type": "object",
      "formProperties": {
        "type": "section",
        "title": {
          "type": "text",
          "content": "Personal Information"
        },
        "description": {
          "type": "text",
          "content": "Please fill out the form below."
        },
      },
      "properties": {
        // ...
      }
    },
    "contact_information": {
      "type": "object",
      "formProperties": {
        "type": "section",
        "title": {
          "type": "text",
          "content": "Contact Information"
        },
        "description": {
          "type": "text",
          "content": "Please fill out the form below."
        },
      },
      "properties": {
        // ...
      }
    }
  }
}
```

We want to have a two-step form with each step rendering a section. We can achieve this by passing
the `section` prop to the `FormRenderer` component.

```jsx
// Step 1 page
<FormRenderer
  schema={schema}
  value={value}
  onChange={setValue}
  section="personal_information" />

// Step 2 page
<FormRenderer
  schema={schema}
  value={value}
  onChange={setValue}
  section="contact_information" />
```

## JSON Schema Form (JSF)

Formuler provides a superset of JSON Schema that allows you to define form behavior
within the schema itself, making it both flexible and erasable for validation purposes.

### Elements

JSF consists is composed of three main element types: **sections**, **layouts**, **contents**, and **controls**.

- **Sections** allow you to segment and group part of your form with its own layout, title, and descriptions.
- **Layouts** allow you to define custom layout for a specific part of the form (eg. grids, rows, columns)
- **Contents** displays property values as static, non-editable elements (eg. images, videos, and etc.)
- **Controls** ables to you to edit and control the schema's property value.

#### List of Components
- `section` - A section element that groups properties together.
- `layout` - A layout element that defines the layout of the form.
- `custom` - A custom element.
- `content` - A content element that displays non-editable content.
  - `text` - A text content element.
  - `rich-text` - A rich text content element.
  - `image` - An image content element.
  - `video` - A video content element.
  - `oembed` - An oembed content element.
- `controls` - A controls element that defines the form controls.
  - `button` - A button control element.
  - `input` - An input control element.
  - `custom-control` - A custom control element.

For full documentation, see [types/json_schema_form.ts](lib/types/json_schema_form.ts).

### Example
To define the form properties for that specific property/schema, simply add a `formProperties`
`object` property with `type` and its associated configurations.

```json
{
  "type": "object",
  "formProperties": {
    "type": "section",
    "title": {
      "type": "text",
      "content": "Personal Information"
    },
    "description": {
      "type": "text",
      "content": "Please fill out the form below."
    },
  },
  "properties": {
    "name": {
      "type": "string",
      "title": "Name",
      "formProperties": {
        "type": "input",
        "inputType": "text",
        "placeholder": "Enter your name"
      }
    },
    "age": {
      "type": "number",
      "title": "Age",
      "formProperties": {
        "type": "input",
        "inputType": "number",
        "placeholder": "Enter your age"
      }
    }
  }
}
```

## Goals
The current goals of Formuler are:
- To be easy and flexible to use.
- To be scalable and customizable.
- To be usable in real-world applications.
- To be compatible with existing form and UI libraries.

...and eventually:
- To be compliant with JSON Schema
- To be fully type-safe
- To be fully tested

...and won't be:
- A full-fledged form library
- A replacement for existing form libraries

The goals are subject to change as the project progresses and
based on the needs I will encounter. Feel free to suggest any
features or improvements by [opening an issue](https://github.com/nedpals/formuler/issues).

## Name Inspiration
[Mr Krabs.](https://youtu.be/bVbvki7IvQY)

## License
Licensed under the [MIT License](LICENSE).

## Copyright
(c) 2024 Ned Palacios
