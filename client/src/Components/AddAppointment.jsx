import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useEffect, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";

function AddAppointment({ onAdd }) {
  const [pets, setPets] = useState([]);
  const [staff, setStaff] = useState([]);
  const [petNameInput, setPetNameInput] = useState("");
  const [filteredPets, setFilteredPets] = useState([]);
  const [showPetDropdown, setShowPetDropdown] = useState(false);
  const [staffNameInput, setStaffNameInput] = useState("");
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/pets`).then((res) => setPets(res.data));
    axios.get(`${API_BASE_URL}/api/staff`).then((res) => setStaff(res.data));
  }, []);

  const formik = useFormik({
    initialValues: {
      reason: "",
      pet_id: null,
      staff_id: null,
      date: "",
    },
    validationSchema: Yup.object({
      reason: Yup.string().required("Reason is required"),
      pet_id: Yup.number().required("Please select a pet"),
      staff_id: Yup.number().required("Please select a staff member"),
      date: Yup.date().required("Date is required"),
    }),
    onSubmit: (values) => {
      setPendingValues(values);
      setConfirmOpen(true);
    },
  });

  const handleConfirm = async () => {
    setConfirmOpen(false);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/appointments`,
        pendingValues
      );
      onAdd(res.data);
      formik.resetForm();
      setPetNameInput("");
      setStaffNameInput("");
    } catch (err) {
      console.error("Error creating appointment:", err);
      alert("Failed to create appointment. Please try again.");
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingValues(null);
  };

  return (
    <>
      <form className="mb-2" onSubmit={formik.handleSubmit}>
        <input
          name="reason"
          placeholder="Enter reason"
          className="form-control mb-2"
          value={formik.values.reason}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.reason && formik.errors.reason && (
          <small className="text-danger">{formik.errors.reason}</small>
        )}

        <input
          name="date"
          type="date"
          className="form-control mb-2"
          value={formik.values.date}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.date && formik.errors.date && (
          <small className="text-danger">{formik.errors.date}</small>
        )}

        <input
          name="petNameInput"
          placeholder="Type to search pet"
          className="form-control mb-2"
          value={petNameInput}
          onChange={(e) => {
            const val = e.target.value;
            setPetNameInput(val);
            if (val.length > 0) {
              const filtered = pets.filter((p) =>
                p.name.toLowerCase().includes(val.toLowerCase())
              );
              setFilteredPets(filtered);
              setShowPetDropdown(true);
            } else {
              setFilteredPets([]);
              setShowPetDropdown(false);
              formik.setFieldValue("pet_id", null);
            }
          }}
          onBlur={() => {
            setTimeout(() => setShowPetDropdown(false), 200);
          }}
        />
        {showPetDropdown && filteredPets.length > 0 && (
          <ul className="list-group mb-2" style={{ maxHeight: "150px", overflowY: "auto" }}>
            {filteredPets.map((p) => (
              <li
                key={p.id}
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
                onMouseDown={() => {
                  setPetNameInput(p.name);
                  formik.setFieldValue("pet_id", p.id);
                  setShowPetDropdown(false);
                }}
              >
                {p.name}
              </li>
            ))}
          </ul>
        )}
        {formik.touched.pet_id && formik.errors.pet_id && (
          <small className="text-danger">{formik.errors.pet_id}</small>
        )}

        <input
          name="staffNameInput"
          placeholder="Type to search staff"
          className="form-control mb-2"
          value={staffNameInput}
          onChange={(e) => {
            const val = e.target.value;
            setStaffNameInput(val);
            if (val.length > 0) {
              const filtered = staff.filter((s) =>
                s.name.toLowerCase().includes(val.toLowerCase())
              );
              setFilteredStaff(filtered);
              setShowStaffDropdown(true);
            } else {
              setFilteredStaff([]);
              setShowStaffDropdown(false);
              formik.setFieldValue("staff_id", null);
            }
          }}
          onBlur={() => {
            setTimeout(() => setShowStaffDropdown(false), 200);
          }}
        />
        {showStaffDropdown && filteredStaff.length > 0 && (
          <ul className="list-group mb-2" style={{ maxHeight: "150px", overflowY: "auto" }}>
            {filteredStaff.map((s) => (
              <li
                key={s.id}
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
                onMouseDown={() => {
                  setStaffNameInput(s.name);
                  formik.setFieldValue("staff_id", s.id);
                  setShowStaffDropdown(false);
                }}
              >
                {s.name}
              </li>
            ))}
          </ul>
        )}
        {formik.touched.staff_id && formik.errors.staff_id && (
          <small className="text-danger">{formik.errors.staff_id}</small>
        )}

        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Add Appointment
          </button>
        </div>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to add this appointment?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}

export default AddAppointment;
