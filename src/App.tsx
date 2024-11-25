import { useState } from "react";
import {
  JSONSchemaForm,
  FormRenderer,
  createDataFromSchema,
  FormTypeFieldRenderer,
  FormFieldRenderer,
} from "../dist/formuler";
import {
  Input,
  useSimpleFormController,
  SimpleForm,
  SimpleFormRenderer,
} from "../dist/simple_form";
import "./App.css";

const Specific: FormFieldRenderer = (props) => {
  const { value: nameValue } = useSimpleFormController<string>(
    "personal_information.name",
  );

  if (
    props.fullProperty !== "personal_information.name" &&
    nameValue !== "123"
  ) {
    return null;
  }

  return <p>Matched!</p>;
};

const SampleInput: FormTypeFieldRenderer<"input"> = (props) => {
  const { value } = useSimpleFormController<string>(props.fullProperty);

  return (
    <div>
      <p style={{ marginBottom: 0 }}>{props.formProperties.label}</p>
      <Input {...props} />
      <p>{value}</p>
    </div>
  );
};

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
    contact_information: {
      type: "object",
      properties: {
        contact_number: {
          type: "string",
          formProperties: {
            type: "input",
            inputType: "text",
            label: "Contact Number",
            placeholder: "Enter your contact number",
          },
        },
        address: {
          type: "object",
          properties: {
            street: {
              type: "string",
              formProperties: {
                type: "input",
                inputType: "text",
                label: "Street",
                placeholder: "Enter your street",
              },
            },
            city: {
              type: "string",
              formProperties: {
                type: "input",
                inputType: "text",
                label: "City",
                placeholder: "Enter your city",
              },
            },
            zip_code: {
              type: "string",
              formProperties: {
                type: "input",
                inputType: "text",
                label: "Zip Code",
                placeholder: "Enter your zip code",
              },
            },
          },
          formProperties: {
            type: "section",
            title: {
              type: "text",
              content: "Address",
            },
          },
        },
      },
      formProperties: {
        type: "section",
        title: {
          type: "text",
          content: "Contact Information",
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
        <SimpleForm value={data} onChange={(data) => setData(data)}>
          <FormRenderer
            schema={schema}
            render={(props) => (
              <SimpleFormRenderer
                {...props}
                formComponentsByProperty={{
                  email: (props) => {
                    return <p>{JSON.stringify(data)}</p>;
                  },
                }}
                formComponentsByType={{
                  string: () => <p>test</p>,
                  object: ({ schema, Outlet, fullProperty }) => {
                    const properties = schema.properties;
                    if (typeof properties !== "object") {
                      return <></>;
                    }

                    return (
                      <div>
                        {Object.keys(properties)
                          .filter((k) => typeof properties[k] === "object")
                          .map((key) => (
                            <Outlet
                              key={`property_${fullProperty}.${key}`}
                              schema={properties[key] as JSONSchemaForm}
                              parentProperty={fullProperty}
                              property={key}
                              preferFormTypeComponent
                              preferPropertyComponent
                              preferSchemaTypeComponent
                            />
                          ))}
                      </div>
                    );
                  },
                }}
                formComponentsByFormType={{
                  input: SampleInput,
                }}
              />
            )}
          />
        </SimpleForm>

        <FormRenderer
          schema={schema}
          render={() => <p>{JSON.stringify(data)}</p>}
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

        <div
          style={{
            backgroundColor: "#F5F5F5",
            padding: "0.2rem 1rem",
            marginTop: "0.5rem",
            borderRadius: "0.5rem",
          }}
        >
          <pre>{JSON.stringify(schema, null, 2)}</pre>
        </div>
      </div>
    </main>
  );
}

export default App;
