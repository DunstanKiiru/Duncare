// Components/AddAppointment.jsx
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useEffect, useState } from "react";

function AddAppointment({ onAdd }) {
  const [pets, setPets] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    axios.get("/api/pets").then((res) => setPets(res.data));
    axios.get("/api/staff").then((res) => setStaff(res.data));
  }, []);

  const formik = useFormik({
    initialValues: {
      reason: "",
      pet_id: "",
      staff_id: "",
    },
    validationSchema: Yup.object({
      reason: Yup.string().required("Required"),
      pet_id: Yup.number().required("Required"),
      staff_id: Yup.number().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post("/api/appointments", values);
        onAdd(res.data);
        resetForm();
      } catch (err) {
        console.error("Error creating appointment", err);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>Add Appointment</h2>
      <input
        name="reason"
        placeholder="Reason"
        onChange={formik.handleChange}
        value={formik.values.reason}
      />
      <select
        name="pet_id"
        onChange={formik.handleChange}
        value={formik.values.pet_id}
      >
        <option value="">Select Pet</option>
        {pets.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
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
      <button type="submit">Add Appointment</button>
    </form>
  );
}

export default AddAppointment;
