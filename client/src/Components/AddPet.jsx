// Components/AddPet.jsx
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useEffect, useState } from "react";

function AddPet({ onAddPet }) {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    axios
      .get("/api/owners")
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
      name: Yup.string().required("Required"),
      species: Yup.string().required("Required"),
      owner_id: Yup.number().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post("/api/pets", values);
        onAddPet(res.data);
        resetForm();
      } catch (err) {
        console.error("Failed to add pet:", err);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>Add Pet</h2>
      <input
        name="name"
        placeholder="Name"
        onChange={formik.handleChange}
        value={formik.values.name}
      />
      <input
        name="species"
        placeholder="Species"
        onChange={formik.handleChange}
        value={formik.values.species}
      />
      <input
        name="breed"
        placeholder="Breed"
        onChange={formik.handleChange}
        value={formik.values.breed}
      />
      <input
        name="sex"
        placeholder="Sex"
        onChange={formik.handleChange}
        value={formik.values.sex}
      />
      <input
        name="color"
        placeholder="Color"
        onChange={formik.handleChange}
        value={formik.values.color}
      />

      <select
        name="owner_id"
        onChange={formik.handleChange}
        value={formik.values.owner_id}
      >
        <option value="">Select Owner</option>
        {owners.map((owner) => (
          <option key={owner.id} value={owner.id}>
            {owner.name}
          </option>
        ))}
      </select>

      <button type="submit">Add Pet</button>
    </form>
  );
}

export default AddPet;
