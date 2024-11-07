import { useState } from "react";
import {
  JSONSchemaForm,
  FormRenderer,
  createDataFromSchema,
  createRenderer,
  Input,
} from "../dist/formuler";
import "./App.css";

const schema: JSONSchemaForm = {
  type: "object",
  properties: {
    personal_information: {
      type: "object",
      properties: {
        name: {
          type: "string",
          formProperties: {
            type: "input",
            inputType: "text",
            label: "Name",
            placeholder: "Enter your name",
          },
        },
        email: {
          type: "string",
          formProperties: {
            type: "input",
            inputType: "email",
            label: "Email",
            placeholder: "Enter your email",
          },
        },
      },
      formProperties: {
        type: "section",
        title: {
          type: "text",
          content: "Personal Information",
        },
      },
    },
  },
};

function App() {
  const [data, setData] = useState(createDataFromSchema(schema));

  return (
    <main
      style={{
        padding: "1rem 0",
        display: "flex",
      }}
    >
      <div
        style={{
          width: "50%",
        }}
      >
        <FormRenderer
          schema={schema}
          section="personal_information"
          render={createRenderer({
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
      </div>

      <div
        style={{
          width: "50%",
          marginLeft: "0.5rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#F5F5F5",
            padding: "0.2rem 1rem",
            borderRadius: "0.5rem",
          }}
        >
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    </main>
  );
}

export default App;
