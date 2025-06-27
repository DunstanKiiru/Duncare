// Components/AddBilling.jsx
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

function AddBilling({ onAdd }) {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    axios.get("/api/pets").then((res) => setPets(res.data));
  }, []);

  const formik = useFormik({
    initialValues: {
      pet_id: "",
      date: "",
      amount: "",
      description: "",
      paid: false,
    },
    validationSchema: Yup.object({
      pet_id: Yup.number().required("Required"),
      amount: Yup.number().required("Amount required"),
      description: Yup.string().required("Description required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post("/api/billings", values);
        onAdd(res.data);
        resetForm();
      } catch (err) {
        console.error("Failed to create billing:", err);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>Create Billing</h2>
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
      <input
        name="date"
        type="date"
        onChange={formik.handleChange}
        value={formik.values.date}
      />
      <input
        name="amount"
        type="number"
        placeholder="Amount"
        onChange={formik.handleChange}
        value={formik.values.amount}
      />
      <input
        name="description"
        placeholder="Description"
        onChange={formik.handleChange}
        value={formik.values.description}
      />
      <label>
        <input
          type="checkbox"
          name="paid"
          checked={formik.values.paid}
          onChange={formik.handleChange}
        />
        Paid
      </label>
      <button type="submit">Add Billing</button>
    </form>
  );
}

export default AddBilling;
