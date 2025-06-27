// Components/AddTreatment.jsx
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useEffect, useState } from "react";

function AddTreatment({ onAddTreatment }) {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    axios.get("/api/staff").then((res) => setStaff(res.data));
  }, []);

  const formik = useFormik({
    initialValues: {
      date: "",
      description: "",
      staff_id: "",
    },
    validationSchema: Yup.object({
      description: Yup.string().required("Required"),
      staff_id: Yup.number().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post("/api/treatments", values);
        onAddTreatment(res.data);
        resetForm();
      } catch (err) {
        console.error("Error creating treatment", err);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>Add Treatment</h2>
      <input
        name="description"
        placeholder="Description"
        onChange={formik.handleChange}
        value={formik.values.description}
      />
      <select
        name="staff_id"
        onChange={formik.handleChange}
        value={formik.values.staff_id}
      >
        <option value="">Select Staff</option>
        {staff.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      <button type="submit">Add Treatment</button>
    </form>
  );
}

export default AddTreatment;
