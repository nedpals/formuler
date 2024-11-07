# Formuler

A dynamic form renderer library for React using a superset of JSON Schema.
Perfect for remote web forms. Still in Alpha.

## Features
- **Dynamic Form Rendering**: Render forms based on a superset of JSON Schema. Fetch the schema from the server or define it locally.
- **Custom Components**: Style our default UI components or use your favorite UI libraries directly.
- **Compatible with Existing Libraries**: Use it with your favorite form libraries like Formik, react-hook-form, or react-jsonschema-form.
- **Type-Safe**: Build type-safe forms easily with TypeScript. (WIP)

## Installation
```bash
npm install formuler
```

## Quickstart
```jsx
import React from 'react';
import { FormRenderer } from 'formuler';

export default function App() {
  // Provide your schema. Fetch the schema from the server or define it locally
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

  // Provide a value and a function to update the value.
  // You may use your favorite state management or form library.
  const [value, setValue] = React.useState({
    name: 'Bob',
    age: 18,
  });

  // Render the form using FormRenderer
  return (
    <FormRenderer
      schema={schema}
      value={value}
      onChange={setValue}
    />
  );
}
```

## Usage
### Extend/Override Default Components
Formuler provides default components for rendering forms. You can extend or override them to fit your needs through the `createRenderer` function.
You may override at the type level, form type level, property-level, and layout-level.

```jsx
<FormRenderer
  schema={schema}
  render={createRenderer({
    formComponentsByType: {
      string: ({ formProperties }) => <p className="text-xl">{formProperties.content}</p>,
    },
    formComponentsByFormType: {
      input: (props) => (
        <div>
          <p style={{ marginBottom: 0 }}>
            {props.formProperties.label}
          </p>
          <Input {...props} />
        </div>
      ),
    },
  })}
  value={data}
  onChange={(data) => {
    setData(data);
  }}
/>
```

### Using Components from UI Libraries
No need for separate packages for your favorite UI libraries. You can use them directly with Formuler.
Simply replace the render function with your favorite UI library components.

```jsx
// ShadCN + react-hook-form example

function default App() {
  // ...

  return (
    <Form {...form}>
      <FormRenderer
        schema={schema}
        value={value}
        onChange={setValue}
        render={({ fullProperty, Outlet }) => (
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

You can create a wizard-like form experience through the `section` prop. This requires the schema you want to pick
to be an `object` schema with `section` form type.

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
Formuler extends JSON Schema with custom properties to define form behavior
within the schema itself, making it both flexible and erasable for validation purposes.

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

### Elements
JSF is composed of multiple elements that can be used to define the form behavior:
- `section` - A section element that groups properties together.
- `layout` - A layout element that defines the layout of the form.
- `content` - A content element that displays non-editable content.
  - `text` - A text content element.
  - `rich-text` - A rich text content element.
  - `image` - An image content element.
  - `video` - A video content element.
  - `oembed` - An oembed content element.
- `controls` - A controls element that defines the form controls.
  - `button` - A button control element.
  - `input` - An input control element.

For full documentation, see [types/json_schema_form.ts](lib/types/json_schema_form.ts).

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
