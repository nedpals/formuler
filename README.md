# Formuler

A headless dynamic form renderer library for React using a superset of JSON Schema.
Perfect for remote web forms. Still in development.

## Proposed Design
### Basic Usage
It all starts with defining a schema and passing it to the `FormRenderer` component.

```jsx
import React from 'react';
import { FormRenderer } from 'formuler';

export default function App() {
  // Fetch the schema from the server or define it locally
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

  const [value, setValue] = React.useState({
    name: 'Bob',
    age: 18,
  });

  // It will render a form with two input fields
  return (
    <FormRenderer
      schema={schema}
      value={value}
      onChange={setValue}
    />
  );
}
```

### Custom Components
No need for separate packages for your favorite UI libraries. You can use them directly with Formuler.

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

### JSON Schema Form (JSF)
JSF is a superset of JSON Schema. It allows you to define form properties directly in the schema.
Current [solutions](https://jsonforms.io) tend to have a separate schema for the form properties
which can be cumbersome.

Since JSON Schema specification [allows](https://json-schema.org/draft/2019-09/json-schema-core#rfc.section.6.5)
adding custom properties, we can use them to define form properties inside the schema instead.

```json
{
  "type": "object",
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

#### Form Slot Values (WIP, Not Final)
For non-data properties such as creating sections or displaying images, JSF makes use
of schema properties to define configurable form slot values. JSF form slot values prefixed
with `$` to avoid conflicts with JSON Schema properties.

This design makes it easier to customize later on when using JSF-compatible form generator tools.

```json
{
  "type": "object",
  "formProperties": {
    "type": "section"
  },
  "properties": {
    "$sectionTitle": {
      "type": "string",
    },
    "$sectionDescription": {
      "type": "string",
    }
    "name": {
      "type": "string",
      "formProperties": {
        "type": "input",
        "inputType": "text",
        "placeholder": "Enter your name"
      }
    },
    "submitButton": {
      "type": "object",
      "properties": {
        "$buttonText": {
          "type": "string",
          "formProperties": {
            "type": "text",
          }
        }
      },
      "formProperties": {
        "type": "button",
        "buttonType": "submit",
        "action": {
          "type": "section-redirect",
          "section": "$next"
        }
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

...and eventually:
- To be compliant with JSON Schema
- To be fully type-safe
- To be fully tested

The goals are subject to change as the project progresses and
based on the needs I will encounter. Feel free to suggest any
features or improvements by [opening an issue](https://github.com/nedpals/formuler/issues).

## Name Inspiration
[Mr Krabs.](https://youtu.be/bVbvki7IvQY)

## License
Licensed under the [MIT License](LICENSE).

## Copyright
(c) 2024 Ned Palacios
