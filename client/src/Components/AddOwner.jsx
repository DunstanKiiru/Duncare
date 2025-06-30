import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";
import SuccessDialog from "./SuccessDialog";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";

function AddOwner({ onAddOwner }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      phone: Yup.string().required("Phone number is required"),
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
        const response = await axios.post(`${API_BASE_URL}/api/owners`, pendingValues);
        onAddOwner(response.data);
        formik.resetForm();
        setPendingValues(null);
      } catch (error) {
        console.error("Error adding owner:", error);
        alert("Failed to add owner. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingValues(null);
  };

  return (
    <div className="p-3 shadow-sm border rounded bg-light">
      <form onSubmit={formik.handleSubmit}>
        <h4 className="mb-3">Add Owner</h4>

        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            name="name"
            className="form-control"
            placeholder="Enter full name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-danger">{formik.errors.name}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            name="email"
            type="email"
            className="form-control"
            placeholder="Enter email address"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-danger">{formik.errors.email}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            name="phone"
            className="form-control"
            placeholder="Enter phone number"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="text-danger">{formik.errors.phone}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add Owner
        </button>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to add this owner?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <SuccessDialog
        open={successOpen}
        message="Owner added successfully."
        onClose={handleSuccessClose}
      />
    </div>
  );
}

export default AddOwner;
