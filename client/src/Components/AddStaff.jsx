// Components/AddStaff.jsx
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

function AddStaff({ onAddStaff }) {
  const formik = useFormik({
    initialValues: {
      name: "",
      role: "",
      email: "",
      phone: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      role: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      phone: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post("/api/staff", values);
        onAddStaff(response.data);
        resetForm();
      } catch (error) {
        console.error("Failed to add staff:", error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>Add Staff</h2>
      <input
        name="name"
        placeholder="Name"
        onChange={formik.handleChange}
        value={formik.values.name}
      />
      {formik.touched.name && formik.errors.name && (
        <div>{formik.errors.name}</div>
      )}

      <input
        name="role"
        placeholder="Role"
        onChange={formik.handleChange}
        value={formik.values.role}
      />
      {formik.touched.role && formik.errors.role && (
        <div>{formik.errors.role}</div>
      )}

      <input
        name="email"
        placeholder="Email"
        onChange={formik.handleChange}
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email && (
        <div>{formik.errors.email}</div>
      )}

      <input
        name="phone"
        placeholder="Phone"
        onChange={formik.handleChange}
        value={formik.values.phone}
      />
      {formik.touched.phone && formik.errors.phone && (
        <div>{formik.errors.phone}</div>
      )}

      <button type="submit">Add Staff Member</button>
    </form>
  );
}

export default AddStaff;
