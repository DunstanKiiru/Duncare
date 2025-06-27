import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const PetSchema = Yup.object().shape({
  name: Yup.string().required("Pet name is required"),
  species: Yup.string().required("Species is required"),
  age: Yup.number()
    .min(0, "Age must be a positive number")
    .required("Age is required"),
  owner_id: Yup.number().required("Owner ID is required"),
});

export default function PetForm({ afterSubmit }) {
  const handleSubmit = async (values, actions) => {
    try {
      const response = await fetch("http://localhost:5000/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        actions.resetForm();
        if (afterSubmit) afterSubmit();
      } else {
        console.error("Failed to create pet.");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <Formik
      initialValues={{ name: "", species: "", age: "", owner_id: "" }}
      validationSchema={PetSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form>
          <div>
            <Field name="name" placeholder="Pet Name" />
            <ErrorMessage
              name="name"
              component="div"
              style={{ color: "red" }}
            />
          </div>

          <div>
            <Field name="species" placeholder="Species (e.g. Dog)" />
            <ErrorMessage
              name="species"
              component="div"
              style={{ color: "red" }}
            />
          </div>

          <div>
            <Field name="age" type="number" placeholder="Age" />
            <ErrorMessage name="age" component="div" style={{ color: "red" }} />
          </div>

          <div>
            <Field name="owner_id" type="number" placeholder="Owner ID" />
            <ErrorMessage
              name="owner_id"
              component="div"
              style={{ color: "red" }}
            />
          </div>

          <button type="submit">Add Pet</button>
        </Form>
      )}
    </Formik>
  );
}
