import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";

function AddStaff({ onAddStaff }) {
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
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/staff`, values);
        onAddStaff(response.data);
        resetForm();
      } catch (error) {
        console.error("Failed to add staff:", error);
        alert("Error adding staff member. Please try again.");
      }
    },
  });

  return (
    <div className="p-3 shadow-sm border rounded bg-light">
      <form onSubmit={formik.handleSubmit}>
        <h4 className="mb-3">Add Staff</h4>

        {/* ... inputs as before ... */}

        <button type="submit" className="btn btn-primary w-100">
          Add Staff Member
        </button>
      </form>
    </div>
  );
}

export default AddStaff;
