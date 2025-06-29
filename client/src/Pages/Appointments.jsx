import { useEffect, useState } from "react";
import axios from "axios";
import AddAppointment from "../Components/AddAppointment";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";
    axios
      .get(`${API_BASE_URL}/api/appointments`)
      .then((res) => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch appointments");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Appointments</h1>
      <AddAppointment onAdd={(a) => setAppointments([...appointments, a])} />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Pet ID</th>
            <th>Staff ID</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id}>
              <td>{a.pet_id}</td>
              <td>{a.staff_id}</td>
              <td>{a.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Appointments;
