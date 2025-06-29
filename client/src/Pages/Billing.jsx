import { useEffect, useState } from "react";
import axios from "axios";
import AddBillings from "../Components/AddBillings";

function Billing() {
  const [bills, setBills] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";
    axios
      .get(`${API_BASE_URL}/api/billings`)
      .then((res) => {
        setBills(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch billing data");
        setLoading(false);
      });
  }, []);

  const markAsPaid = async (id) => {
    const confirm = window.confirm("Mark this bill as paid?");
    if (!confirm) return;

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";
      const res = await axios.patch(`${API_BASE_URL}/api/billings/${id}`, { paid: true });
      setBills((prev) =>
        prev.map((b) => (b.id === id ? { ...b, paid: true } : b))
      );
    } catch (err) {
      console.error("Failed to update billing status", err);
    }
  };

  // Sort bills by id descending (newest first)
  const sortedBills = [...bills].sort((a, b) => b.id - a.id);

  // Filter bills based on filter dropdown and search query (pet_id, amount)
  const filteredBills = sortedBills.filter((b) => {
    if (filter === "paid" && !b.paid) return false;
    if (filter === "unpaid" && b.paid) return false;

    const query = searchQuery.toLowerCase();
    return (
      b.pet_id.toString().includes(query) ||
      b.amount.toString().includes(query)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  if (loading) return <div>Loading bills...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="billing-container d-flex flex-wrap gap-4 justify-content-between">
      <div
        className="billing-form flex-grow-1"
        style={{ minWidth: "300px", maxWidth: "400px" }}
      >
        <h2 className="text-center">Add Billing</h2>
        <AddBillings onAdd={(bill) => setBills([...bills, bill])} />
      </div>

      <div className="billing-list flex-grow-2" style={{ flex: "1 1 60%" }}>
        <h3 className="text-center">Billing Records</h3>

        <div className="d-flex justify-content-between mb-3">
          <div>
            <label>Filter:</label>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="form-select"
            >
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          <input
            type="text"
            className="form-control w-50"
            placeholder="Search bills..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Pet ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBills.map((b) => (
              <tr key={b.id}>
                <td>{b.pet_id}</td>
                <td>Ksh {b.amount}</td>
                <td>
                  {b.paid ? (
                    <span style={{ color: "green" }}>Paid ✅</span>
                  ) : (
                    <span style={{ color: "red" }}>Unpaid ❌</span>
                  )}
                </td>
                <td>
                  {!b.paid && (
                    <button className="btn btn-primary btn-sm" onClick={() => markAsPaid(b.id)}>
                      Mark as Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <nav aria-label="Billing pagination">
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

export default Billing;
