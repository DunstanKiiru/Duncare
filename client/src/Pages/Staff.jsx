import { useEffect, useState } from "react";
import axios from "axios";
import AddStaff from "../Components/AddStaff";

function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get("/api/staff");
        setStaff(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch staff data");
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  if (loading) {
    return <div>Loading staff...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Staff</h1>
      <AddStaff onAddStaff={(member) => setStaff([...staff, member])} />
      <ul>
        {staff.map((s) => (
          <li key={s.id}>
            {s.name} ({s.role}) - {s.email}, {s.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Staff;
