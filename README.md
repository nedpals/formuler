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

## Documentation
See [https://github.com/nedpals/formuler](https://github.com/nedpals/formuler) for the full documentation.

## License
Licensed under the [MIT License](LICENSE).

## Copyright
(c) 2024 Ned Palacios
