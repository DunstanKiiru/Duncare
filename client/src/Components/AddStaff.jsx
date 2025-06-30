import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";

function AddStaff({ onAddStaff }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      role: "",
      email: "",
      phone: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      role: Yup.string().required("Role is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone is required"),
    }),
    onSubmit: (values) => {
      setPendingValues(values);
      setConfirmOpen(true);
    },
  });

  const handleConfirm = async () => {
    setConfirmOpen(false);
    if (pendingValues) {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/staff`, pendingValues);
        onAddStaff(response.data);
        formik.resetForm();
        setPendingValues(null);
        setSuccessOpen(true);
      } catch (error) {
        console.error("Failed to add staff:", error);
        alert("Error adding staff member. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingValues(null);
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };

  return (
    <div className="p-3 shadow-sm border rounded bg-light">
      <form onSubmit={formik.handleSubmit}>
        <h4 className="mb-3">Add Staff</h4>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={`form-control${formik.touched.name && formik.errors.name ? " is-invalid" : ""}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="invalid-feedback">{formik.errors.name}</div>
          ) : null}
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label">
            Role
          </label>
          <input
            id="role"
            name="role"
            type="text"
            className={`form-control${formik.touched.role && formik.errors.role ? " is-invalid" : ""}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.role}
          />
          {formik.touched.role && formik.errors.role ? (
            <div className="invalid-feedback">{formik.errors.role}</div>
          ) : null}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-control${formik.touched.email && formik.errors.email ? " is-invalid" : ""}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="invalid-feedback">{formik.errors.email}</div>
          ) : null}
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            className={`form-control${formik.touched.phone && formik.errors.phone ? " is-invalid" : ""}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
          />
          {formik.touched.phone && formik.errors.phone ? (
            <div className="invalid-feedback">{formik.errors.phone}</div>
          ) : null}
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add Staff Member
        </button>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to add this staff member?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default AddStaff;

