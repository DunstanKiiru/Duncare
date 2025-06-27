// Pages/Owners.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import AddOwner from "../Components/AddOwner";

function Owners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/owners")
      .then((res) => {
        setOwners(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch owners");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading owners...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Owners</h1>
      <AddOwner onAddOwner={(owner) => setOwners([...owners, owner])} />
      <ul>
        {owners.map((o) => (
          <li key={o.id}>
            {o.name} - {o.email} - {o.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Owners;
