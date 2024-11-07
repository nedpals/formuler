import { useState } from "react";
import { JSONSchemaForm, FormRenderer } from "../dist/formuler";
import "./App.css";

const schema: JSONSchemaForm = {
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
};

function App() {
  const [data, setData] = useState({
    name: "",
    email: "",
  });

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
        <FormRenderer schema={schema} value={data} onChange={setData} />
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
