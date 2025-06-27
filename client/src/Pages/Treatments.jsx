// Pages/Treatments.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import AddTreatment from "../Components/AddTreatment";

function Treatments() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/treatments")
      .then((res) => {
        setTreatments(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch treatments");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading treatments...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Treatments</h1>
      <AddTreatment onAddTreatment={(t) => setTreatments([...treatments, t])} />
      <ul>
        {treatments.map((t) => (
          <li key={t.id}>
            {t.description} on {t.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Treatments;
