import { useEffect, useState } from "react";
import axios from "axios";
import AddAppointment from "../Components/AddAppointment";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";

    const fetchAppointments = axios.get(`${API_BASE_URL}/api/appointments`);
    const fetchStaff = axios.get(`${API_BASE_URL}/api/staff`);
    const fetchPets = axios.get(`${API_BASE_URL}/api/pets`);

    Promise.all([fetchAppointments, fetchStaff, fetchPets])
      .then(([appointmentsRes, staffRes, petsRes]) => {
        setAppointments(appointmentsRes.data);
        setStaff(staffRes.data);
        setPets(petsRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch appointments, staff, or pets data");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div>{error}</div>;

  const staffMap = staff.reduce((acc, s) => {
    acc[s.id] = s.name;
    return acc;
  }, {});

  const petMap = pets.reduce((acc, p) => {
    acc[p.id] = p.name;
    return acc;
  }, {});

  const sortedAppointments = [...appointments].sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date);
    }
    return b.id - a.id;
  });

  const filteredAppointments = sortedAppointments.filter((a) => {
    const petName = petMap[a.pet_id] || "";
    const staffName = staffMap[a.staff_id] || "";
    const reason = a.reason || "";
    const query = searchQuery.toLowerCase();
    return (
      petName.toLowerCase().includes(query) ||
      staffName.toLowerCase().includes(query) ||
      reason.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="appointments-container d-flex flex-wrap gap-4 justify-content-between">
      <div
        className="appointments-form flex-grow-1"
        style={{ minWidth: "300px", maxWidth: "400px" }}
      >
        <h2 className="text-center">Add Appointment</h2>
        <AddAppointment onAdd={(a) => setAppointments([...appointments, a])} />
      </div>

      <div className="appointments-list flex-grow-2" style={{ flex: "1 1 60%" }}>
        <h3 className="text-center">Appointments List</h3>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search appointments..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />

        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Pet ID</th>
              <th>Pet Name</th>
              <th>Staff Name</th>
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAppointments.map((a) => (
              <tr key={a.id}>
                <td>{a.pet_id}</td>
                <td>{petMap[a.pet_id] || "Unknown"}</td>
                <td>{staffMap[a.staff_id] || a.staff_id}</td>
                <td>{a.reason}</td>
                <td>{a.date ? a.date.split('T')[0] : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <nav aria-label="Appointments pagination">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, idx) => (
              <li
                key={idx + 1}
                className={`page-item ${currentPage === idx + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => handlePageChange(idx + 1)}>
                  {idx + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Appointments;
