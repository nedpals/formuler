# Formuler

A headless dynamic form renderer library for React using a superset of JSON Schema. Perfect for remote web forms. Still in development.

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

## Name Inspiration
[Mr Krabs.](https://youtu.be/bVbvki7IvQY)

## License
Licensed under the [MIT License](LICENSE).

## Copyright
(c) 2024 Ned Palacios
