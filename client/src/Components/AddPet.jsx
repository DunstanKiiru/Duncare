import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";

function AddPet({ onAddPet }) {
  const [owners, setOwners] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/owners`)
      .then((res) => setOwners(res.data))
      .catch((err) => console.error("Failed to fetch owners:", err));
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      species: "",
      breed: "",
      sex: "",
      owner_id: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      species: Yup.string().required("Species is required"),
      breed: Yup.string().required("Breed is required"),
      sex: Yup.string().required("Sex is required"),
      owner_id: Yup.string().required("Owner is required"),
    }),
    onSubmit: (values) => {
      setErrorMessage("");
      setPendingValues(values);
      setConfirmOpen(true);
    },
  });

  const handleConfirm = async () => {
    setConfirmOpen(false);
    if (pendingValues) {
      try {
        // Convert owner_id to integer before sending
        const payload = { ...pendingValues, owner_id: parseInt(pendingValues.owner_id, 10) };
        const res = await axios.post(`${API_BASE_URL}/api/pets`, payload);
        if (onAddPet) {
          onAddPet(res.data);
        }
        formik.resetForm();
        setPendingValues(null);
      } catch (err) {
        console.error("Failed to add pet:", err);
        if (err.response && err.response.data && err.response.data.error) {
          setErrorMessage(err.response.data.error);
        } else {
          setErrorMessage("Error adding pet. Please try again.");
        }
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
        <h4 className="mb-3">Add Pet</h4>

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            name="name"
            className="form-control"
            placeholder="Pet's name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-danger">{formik.errors.name}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Species</label>
          <input
            name="species"
            className="form-control"
            placeholder="Species"
            value={formik.values.species}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.species && formik.errors.species && (
            <div className="text-danger">{formik.errors.species}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Breed</label>
          <input
            name="breed"
            className="form-control"
            placeholder="Breed"
            value={formik.values.breed}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.breed && formik.errors.breed && (
            <div className="text-danger">{formik.errors.breed}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Sex</label>
          <input
            name="sex"
            className="form-control"
            placeholder="Sex"
            value={formik.values.sex}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.sex && formik.errors.sex && (
            <div className="text-danger">{formik.errors.sex}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Owner</label>
          <select
            name="owner_id"
            className="form-control"
            value={formik.values.owner_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">-- Select Owner --</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name}
              </option>
            ))}
          </select>
          {formik.touched.owner_id && formik.errors.owner_id && (
            <div className="text-danger">{formik.errors.owner_id}</div>
          )}
        </div>

        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100">
          Add Pet
        </button>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to add this pet?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default AddPet;
