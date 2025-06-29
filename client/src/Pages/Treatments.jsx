import { useEffect, useState } from "react";
import axios from "axios";
import AddTreatment from "../Components/AddTreatment";

function Treatments() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";
    axios
      .get(`${API_BASE_URL}/api/treatments`)
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
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {treatments.map((t) => (
            <tr key={t.id}>
              <td>{t.description}</td>
              <td>{t.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Treatments;
