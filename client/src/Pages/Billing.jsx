import { useEffect, useState } from "react";
import axios from "axios";
import AddBillings from "../Components/AddBillings";
import ConfirmDialog from "../Components/ConfirmDialog";
import SuccessDialog from "../Components/SuccessDialog";

function Billing() {
  const [bills, setBills] = useState([]);
  const [pets, setPets] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedBillIdToDelete, setSelectedBillIdToDelete] = useState(null);

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
    axios
      .get(`${API_BASE_URL}/api/pets`)
      .then((res) => {
        setPets(res.data);
      })
      .catch(() => {
        setError("Failed to fetch pets data");
      });
  }, []);

  const markAsPaid = (id) => {
    setSelectedBillId(id);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (selectedBillId === null) return;
    setConfirmOpen(false);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";
      await axios.patch(`${API_BASE_URL}/api/billings/${selectedBillId}`, { paid: true });
      setBills((prev) =>
        prev.map((b) => (b.id === selectedBillId ? { ...b, paid: true } : b))
      );
      setSelectedBillId(null);
    } catch (err) {
      console.error("Failed to update billing status", err);
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setSelectedBillId(null);
  };

  const handleDeleteClick = (id) => {
    setSelectedBillIdToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedBillIdToDelete === null) return;
    setDeleteConfirmOpen(false);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";
      await axios.delete(`${API_BASE_URL}/api/billings/${selectedBillIdToDelete}`);
      setBills((prev) => prev.filter((b) => b.id !== selectedBillIdToDelete));
      setSelectedBillIdToDelete(null);
    } catch (err) {
      console.error("Failed to delete billing", err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setSelectedBillIdToDelete(null);
  };

  const sortedBills = [...bills].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "paid") {
      aValue = aValue ? 1 : 0;
      bValue = bValue ? 1 : 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const filteredBills = sortedBills.filter((b) => {
    if (filter === "paid" && !b.paid) return false;
    if (filter === "unpaid" && b.paid) return false;

    const query = searchQuery.toLowerCase();
    const pet = pets.find((p) => p.id === b.pet_id);
    const petName = pet ? pet.name.toLowerCase() : "";
    return (
      b.pet_id.toString().includes(query) ||
      b.amount.toString().includes(query) ||
      petName.includes(query)
    );
  });

  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const toggleSortByStatus = () => {
    if (sortField === "paid") {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField("paid");
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  if (loading) return <div>Loading bills...</div>;
  if (error) return <div>{error}</div>;

  const getPetName = (pet_id) => {
    const pet = pets.find((p) => p.id === pet_id);
    return pet ? pet.name : pet_id;
  };

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
              <th>Pet Name</th>
              <th>Amount</th>
              <th style={{ cursor: "pointer" }} onClick={toggleSortByStatus}>
                Status{" "}
                {sortField === "paid"
                  ? sortDirection === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBills.map((b) => (
              <tr key={b.id}>
                <td>{getPetName(b.pet_id)}</td>
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
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => markAsPaid(b.id)}
                    >
                      Mark as Paid
                    </button>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteClick(b.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <nav aria-label="Billing pagination">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, idx) => (
              <li
                key={idx + 1}
                className={`page-item ${
                  currentPage === idx + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        message="Mark this bill as paid?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <ConfirmDialog
        open={deleteConfirmOpen}
        message="Are you sure you want to delete this bill?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
      <SuccessDialog
        open={successOpen}
        message="Billing deleted successfully."
        onClose={handleSuccessClose}
      />
    </div>
  );
}

export default Billing;
