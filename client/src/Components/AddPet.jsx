import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";

function AddPet({ onAddPet }) {
  const [owners, setOwners] = useState([]);

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
      color: "",
      owner_id: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      species: Yup.string().required("Species is required"),
      owner_id: Yup.number().required("Owner is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post(`${API_BASE_URL}/api/pets`, values);
        onAddPet(res.data);
        resetForm();
      } catch (err) {
        console.error("Failed to add pet:", err);
        alert("Error adding pet. Please try again.");
      }
    },
  });

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
            placeholder="Breed (optional)"
            value={formik.values.breed}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Sex</label>
          <input
            name="sex"
            className="form-control"
            placeholder="Sex (optional)"
            value={formik.values.sex}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Color</label>
          <input
            name="color"
            className="form-control"
            placeholder="Color (optional)"
            value={formik.values.color}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Owner</label>
          <select
            name="owner_id"
            className="form-select"
            value={formik.values.owner_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select Owner</option>
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

        <button type="submit" className="btn btn-primary w-100">
          Add Pet
        </button>
      </form>
    </div>
  );
}

export default AddPet;
