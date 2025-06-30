import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";

function AddBilling({ onAdd }) {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/pets`).then((res) => setPets(res.data));
  }, []);

  const formik = useFormik({
    initialValues: {
      pet_id: "",
      pet_name: "",
      date: "",
      amount: "",
      description: "",
      paid: false,
    },
    validationSchema: Yup.object({
      pet_name: Yup.string().required("Pet is required"),
      amount: Yup.number().required("Amount is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post(`${API_BASE_URL}/api/billings`, values);
        onAdd(res.data);
        resetForm();
      } catch (err) {
        console.error("Failed to create billing:", err);
        alert("Error: Could not create billing entry.");
      }
    },
  });

  const findPetIdByName = (name) => {
    const pet = pets.find((p) => p.name === name);
    return pet ? pet.id : "";
  };

  return (
    <div className="p-3 shadow-sm border rounded bg-light">
      <form onSubmit={formik.handleSubmit}>
        <h4 className="mb-3">Create Billing</h4>

        <div className="mb-3">
          <label className="form-label">Pet</label>
          <input
            name="pet_name"
            className="form-control"
            placeholder="Select Pet"
            list="pets-list"
            value={formik.values.pet_name || ""}
            onChange={(e) => {
              const petName = e.target.value;
              formik.setFieldValue("pet_name", petName);
              formik.setFieldValue("pet_id", findPetIdByName(petName));
            }}
            onBlur={formik.handleBlur}
          />
          <datalist id="pets-list">
            {pets.map((p) => (
              <option key={p.id} value={p.name} />
            ))}
          </datalist>
          {formik.touched.pet_name && formik.errors.pet_name && (
            <div className="text-danger">{formik.errors.pet_name}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Billing Date</label>
          <input
            name="date"
            type="date"
            className="form-control"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input
            name="amount"
            type="number"
            className="form-control"
            placeholder="Enter amount"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.amount && formik.errors.amount && (
            <div className="text-danger">{formik.errors.amount}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <input
            name="description"
            className="form-control"
            placeholder="Enter description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-danger">{formik.errors.description}</div>
          )}
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="paid"
            id="paid"
            checked={formik.values.paid}
            onChange={formik.handleChange}
          />
          <label className="form-check-label" htmlFor="paid">
            Paid
          </label>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add Billing
        </button>
      </form>
    </div>
  );
}

export default AddBilling;
