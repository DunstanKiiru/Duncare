import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";

function AddTreatment({ onAddTreatment }) {
  const [staff, setStaff] = useState([]);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/staff`).then((res) => setStaff(res.data));
    axios.get(`${API_BASE_URL}/api/pets`).then((res) => setPets(res.data));
  }, []);

  const formik = useFormik({
    initialValues: {
      date: "",
      description: "",
      staff_id: "",
      pet_id: "",
    },
    validationSchema: Yup.object({
      description: Yup.string().required("Required"),
      staff_id: Yup.number().required("Required"),
      pet_id: Yup.number().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post(`${API_BASE_URL}/api/treatments`, values);
        onAddTreatment(res.data);
        resetForm();
      } catch (err) {
        console.error("Error creating treatment", err);
      }
    },
  });

  return (
    <>
      <h2 className="mb-3 text-center"></h2>
      <form onSubmit={formik.handleSubmit}>
        <input
          name="description"
          placeholder="Description"
          className="form-control mb-2"
          onChange={formik.handleChange}
          value={formik.values.description}
          onBlur={formik.handleBlur}
        />
        {formik.touched.description && formik.errors.description && (
          <small className="text-danger">{formik.errors.description}</small>
        )}

        <select
          name="pet_id"
          className="form-select mb-2"
          onChange={formik.handleChange}
          value={formik.values.pet_id}
          onBlur={formik.handleBlur}
        >
          <option value="">Select Pet</option>
          {pets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {formik.touched.pet_id && formik.errors.pet_id && (
          <small className="text-danger">{formik.errors.pet_id}</small>
        )}

        <select
          name="staff_id"
          className="form-select mb-2"
          onChange={formik.handleChange}
          value={formik.values.staff_id}
          onBlur={formik.handleBlur}
        >
          <option value="">Select Staff</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {formik.touched.staff_id && formik.errors.staff_id && (
          <small className="text-danger">{formik.errors.staff_id}</small>
        )}

        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Add Treatment
          </button>
        </div>
      </form>
    </>
  );
}

export default AddTreatment;
