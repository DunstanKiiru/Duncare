import { useEffect, useState } from "react";
import axios from "axios";
import AddOwner from "../Components/AddOwner";

function Owners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";
    axios
      .get(`${API_BASE_URL}/api/owners`)
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

  const sortedOwners = [...owners].sort((a, b) => b.id - a.id);

  const filteredOwners = sortedOwners.filter((o) => {
    const query = searchQuery.toLowerCase();
    return (
      o.name.toLowerCase().includes(query) ||
      o.email.toLowerCase().includes(query) ||
      o.phone.toLowerCase().includes(query)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredOwners.length / itemsPerPage);
  const paginatedOwners = filteredOwners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="owners-container d-flex flex-wrap gap-4 justify-content-between">
      <div
        className="owners-form flex-grow-1"
        style={{ minWidth: "300px", maxWidth: "400px" }}
      >
        <h2 className="text-center">Add Owner</h2>
        <AddOwner onAddOwner={(owner) => setOwners([...owners, owner])} />
      </div>

      <div className="owners-list flex-grow-2" style={{ flex: "1 1 60%" }}>
        <h3 className="text-center">Owners List</h3>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search owners..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />

        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOwners.map((o) => (
              <tr key={o.id}>
                <td>{o.name}</td>
                <td>{o.email}</td>
                <td>{o.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <nav aria-label="Owners pagination">
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

export default Owners;
