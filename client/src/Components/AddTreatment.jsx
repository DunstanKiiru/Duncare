import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";

function AddTreatment({ onAddTreatment }) {
  const [staff, setStaff] = useState([]);
  const [pets, setPets] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);

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
    onSubmit: (values) => {
      setPendingValues(values);
      setConfirmOpen(true);
    },
  });

  const findPetIdByName = (name) => {
    const pet = pets.find((p) => p.name === name);
    return pet ? pet.id : "";
  };

  const findStaffIdByName = (name) => {
    const staffMember = staff.find((s) => s.name === name);
    return staffMember ? staffMember.id : "";
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    if (pendingValues) {
      try {
        const res = await axios.post(`${API_BASE_URL}/api/treatments`, pendingValues);
        onAddTreatment(res.data);
        formik.resetForm();
        setPendingValues(null);
      } catch (err) {
        console.error("Error creating treatment", err);
      }
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingValues(null);
  };

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
          <small className="text-danger">{formik.errors.pet_name}</small>
        )}

        <input
          name="staff_name"
          className="form-control mb-2"
          placeholder="Select Staff"
          list="staff-list"
          value={formik.values.staff_name || ""}
          onChange={(e) => {
            const staffName = e.target.value;
            formik.setFieldValue("staff_name", staffName);
            formik.setFieldValue("staff_id", findStaffIdByName(staffName));
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

      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to add this treatment?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <SuccessDialog
        open={successOpen}
        message="Billing added successfully."
        onClose={handleSuccessClose}
      />
    </>
  );
}

export default AddTreatment;
