import { useEffect, useState } from "react";
import PetForm from "../Components/AddPet";
import axios from "axios";

function Pets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";
        const response = await axios.get(`${API_BASE_URL}/api/pets`);
        setPets(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch pets data");
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (loading) {
    return <div>Loading pets...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Sort pets by id descending (newest first)
  const sortedPets = [...pets].sort((a, b) => b.id - a.id);

  // Filter pets based on search query (name, species)
  const filteredPets = sortedPets.filter((pet) => {
    const query = searchQuery.toLowerCase();
    return (
      pet.name.toLowerCase().includes(query) ||
      pet.species.toLowerCase().includes(query)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPets.length / itemsPerPage);
  const paginatedPets = filteredPets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="pets-container d-flex flex-wrap gap-4 justify-content-between">
      <div
        className="pets-form flex-grow-1"
        style={{ minWidth: "300px", maxWidth: "400px" }}
      >
        <h2 className="text-center">Add Pet</h2>
        <PetForm />
      </div>

      <div className="pets-list flex-grow-2" style={{ flex: "1 1 60%" }}>
        <h3 className="text-center">Pets List</h3>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search pets..."
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
          <th>Species</th>
          <th>Breed</th>
          <th>Sex</th>
        </tr>
      </thead>
      <tbody>
        {paginatedPets.map((pet) => (
          <tr key={pet.id}>
            <td>{pet.name}</td>
            <td>{pet.species}</td>
            <td>{pet.breed}</td>
            <td>{pet.sex}</td>
          </tr>
        ))}
      </tbody>
        </table>

        <nav aria-label="Pets pagination">
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

export default Pets;
