import { useEffect, useState } from "react";
import PetForm from "../Components/AddPet";
import axios from "axios";

function Pets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";
        const response = await axios.get(`${API_BASE_URL}/api/pets`);
        setPets(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch pets data");
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (loading) {
    return <div>Loading pets...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Pets</h1>
      <PetForm />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Species</th>
            <th>Age (years)</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet) => (
            <tr key={pet.id}>
              <td>{pet.name}</td>
              <td>{pet.species}</td>
              <td>{pet.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Pets;
