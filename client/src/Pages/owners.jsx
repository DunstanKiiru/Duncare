import { useEffect, useState } from "react";
import AddOwner from "../Components/AddOwner";
import axios from "axios";

function Owners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await axios.get("/api/owners");
        setOwners(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch owners data");
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  if (loading) {
    return <div>Loading owners...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Owners</h1>
      <AddOwner onAddOwner={(owner) => setOwners([...owners, owner])} />
      <ul>
        {owners.map((owner) => (
          <li key={owner.id}>
            {owner.name} ({owner.email}) - {owner.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Owners;
