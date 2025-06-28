import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";

function AddAppointment({ onAdd }) {
  const [pets, setPets] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/pets`).then((res) => setPets(res.data));
    axios.get(`${API_BASE_URL}/api/staff`).then((res) => setStaff(res.data));
  }, []);

  const formik = useFormik({
    initialValues: {
      reason: "",
      pet_id: "",
      staff_id: "",
    },
    validationSchema: Yup.object({
      reason: Yup.string().required("Reason is required"),
      pet_id: Yup.number().required("Please select a pet"),
      staff_id: Yup.number().required("Please select a staff member"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/appointments`,
          values
        );
        onAdd(res.data);
        resetForm();
      } catch (err) {
        console.error("Error creating appointment:", err);
        alert("Failed to create appointment. Please try again.");
      }
    },
  });

  return (
    <div className="p-3 shadow-sm border rounded bg-light">
      <form onSubmit={formik.handleSubmit}>
        <h4 className="mb-3">Add Appointment</h4>

        <div className="mb-3">
          <label className="form-label">Reason</label>
          <input
            name="reason"
            className="form-control"
            placeholder="Enter reason"
            value={formik.values.reason}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.reason && formik.errors.reason && (
            <div className="text-danger">{formik.errors.reason}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Select Pet</label>
          <select
            name="pet_id"
            className="form-select"
            value={formik.values.pet_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">-- Choose a pet --</option>
            {pets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {formik.touched.pet_id && formik.errors.pet_id && (
            <div className="text-danger">{formik.errors.pet_id}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Assign Staff</label>
          <select
            name="staff_id"
            className="form-select"
            value={formik.values.staff_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">-- Choose staff --</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {formik.touched.staff_id && formik.errors.staff_id && (
            <div className="text-danger">{formik.errors.staff_id}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add Appointment
        </button>
      </form>
    </div>
  );
}

export default AddAppointment;
