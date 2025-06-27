import { useEffect, useState } from "react";
import PetForm from "../Components/AddPet";


export default function Pets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPets = async () => {
    try {
      setLoading(true);
      const data = await fetchPets();
      setPets(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading pets:", error);
    }
  };

  useEffect(() => {
    loadPets();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>🐾 Pets</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {pets.map((pet) => (
            <li key={pet.id}>
              <strong>{pet.name}</strong> ({pet.species}) — Age: {pet.age} —
              Owner ID: {pet.owner_id}
            </li>
          ))}
        </ul>
      )}

      <hr />

      <h2>Add New Pet</h2>
      <PetForm afterSubmit={loadPets} />
    </div>
  );
}
