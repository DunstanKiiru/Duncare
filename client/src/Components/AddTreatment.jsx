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
      staff_name: "",
      pet_name: "",
    },
    validationSchema: Yup.object({
      description: Yup.string().required("Required"),
      staff_name: Yup.string().required("Required"),
      pet_name: Yup.string().required("Required"),
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

        <input
          name="pet_name"
          className="form-control mb-2"
          placeholder="Select Pet"
          list="pets-list"
          value={formik.values.pet_name || ""}
          onChange={(e) => {
            formik.setFieldValue("pet_name", e.target.value);
            formik.setFieldValue("pet_id", "");
          }}
          onBlur={formik.handleBlur}
        />
        <datalist id="pets-list">
          {pets.map((p) => (
            <option key={p.id} value={p.name} />
          ))}
        </datalist>
        {formik.touched.pet_name && formik.errors.pet_name && (
          <small className="text-danger">{formik.errors.pet_name}</small>
        )}

        <input
          name="staff_name"
          className="form-control mb-2"
          placeholder="Select Staff"
          list="staff-list"
          value={formik.values.staff_name || ""}
          onChange={(e) => {
            formik.setFieldValue("staff_name", e.target.value);
            formik.setFieldValue("staff_id", "");
          }}
          onBlur={formik.handleBlur}
        />
        <datalist id="staff-list">
          {staff.map((s) => (
            <option key={s.id} value={s.name} />
          ))}
        </datalist>
        {formik.touched.staff_name && formik.errors.staff_name && (
          <small className="text-danger">{formik.errors.staff_name}</small>
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
