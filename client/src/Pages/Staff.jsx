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
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";
        const response = await axios.get(`${API_BASE_URL}/api/staff`);
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
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.role}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Staff;
