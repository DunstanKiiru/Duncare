// Pages/Billing.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import AddBillings from "../Components/AddBillings";

function Billing() {
  const [bills, setBills] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const filteredBills = bills.filter((b) => {
    if (filter === "all") return true;
    if (filter === "paid") return b.paid;
    if (filter === "unpaid") return !b.paid;
  });

  if (loading) return <div>Loading bills...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Billing Records</h1>

      <div>
        <label>Filter:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      <AddBillings onAdd={(bill) => setBills([...bills, bill])} />

      <ul>
        {filteredBills.map((b) => (
          <li key={b.id}>
            <strong>Pet ID:</strong> {b.pet_id}, <strong>Amount:</strong> Ksh{" "}
            {b.amount}, <strong>Status:</strong>{" "}
            {b.paid ? (
              <span style={{ color: "green" }}>Paid ✅</span>
            ) : (
              <>
                <span style={{ color: "red" }}>Unpaid ❌</span>{" "}
                <button onClick={() => markAsPaid(b.id)}>Mark as Paid</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Billing;
