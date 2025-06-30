import { useEffect, useState } from "react";
import axios from "axios";
import AddTreatment from "../Components/AddTreatment";

function Treatments() {
  const [treatments, setTreatments] = useState([]);
  const [pets, setPets] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState(null);

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";

    const fetchTreatments = axios.get(`${API_BASE_URL}/api/treatments`);
    const fetchPets = axios.get(`${API_BASE_URL}/api/pets`);
    const fetchStaff = axios.get(`${API_BASE_URL}/api/staff`);

    Promise.all([fetchTreatments, fetchPets, fetchStaff])
      .then(([treatmentsRes, petsRes, staffRes]) => {
        setTreatments(treatmentsRes.data);
        setPets(petsRes.data);
        setStaff(staffRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch treatments, pets, or staff data");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading treatments...</div>;
  if (error) return <div>{error}</div>;

  const petMap = pets.reduce((acc, p) => {
    acc[p.id] = p.name;
    return acc;
  }, {});

  const staffMap = staff.reduce((acc, s) => {
    acc[s.id] = s.name;
    return acc;
  }, {});

  const sortedTreatments = [...treatments].sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date);
    }
    return b.id - a.id;
  });

  const filteredTreatments = sortedTreatments.filter((t) => {
    const petNames = t.pets && t.pets.length > 0 ? t.pets.map(p => p.name).join(", ").toLowerCase() : "";
    const staffName = staffMap[t.staff_id] ? staffMap[t.staff_id].toLowerCase() : "";
    const description = t.description ? t.description.toLowerCase() : "";
    const date = t.date ? t.date.toLowerCase() : "";
    const query = searchQuery.toLowerCase();
    return (
      petNames.includes(query) ||
      staffName.includes(query) ||
      description.includes(query) ||
      date.includes(query)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredTreatments.length / itemsPerPage);
  const paginatedTreatments = filteredTreatments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="treatments-container d-flex flex-wrap gap-4 justify-content-between">
      <div
        className="treatments-form flex-grow-1"
        style={{ minWidth: "300px", maxWidth: "400px" }}
      >
        <h2 className="text-center">Add Treatment</h2>
        <AddTreatment onAddTreatment={(t) => setTreatments([...treatments, t])} />
      </div>

      <div className="treatments-list flex-grow-2" style={{ flex: "1 1 60%" }}>
        <h3 className="text-center">Treatments List</h3>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search treatments..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />

        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Pet Name</th>
              <th>Staff Name</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTreatments.map((t) => (
              <tr key={t.id}>
                <td>{
                  t.pets && t.pets.length > 0
                    ? t.pets.map(p => p.name).join(", ")
                    : t.pet_id && petMap[t.pet_id]
                    ? petMap[t.pet_id]
                    : t.pet && t.pet.name
                    ? t.pet.name
                    : "Unknown"
                }</td>
                <td>{staffMap[t.staff_id] || "Unknown"}</td>
                <td>{t.description}</td>
                <td>{t.date ? t.date.split('T')[0] : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <nav aria-label="Treatments pagination">
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

export default Treatments;
