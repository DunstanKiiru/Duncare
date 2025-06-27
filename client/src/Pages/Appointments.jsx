// Pages/Appointments.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import AddAppointment from "../Components/AddAppointment";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/appointments`)
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
      <ul>
        {appointments.map((a) => (
          <li key={a.id}>
            Pet ID: {a.pet_id} | Staff ID: {a.staff_id} | Reason: {a.reason}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Appointments;
