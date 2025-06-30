import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fdfdfd",
        color: "#333",
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          padding: "4rem 2rem",
          textAlign: "center",
          background: "linear-gradient(to right, #e0f7fa, #ffffff)",
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          🐾 Welcome to Duncare Vet Clinic
        </h1>
        <p style={{ fontSize: "1.3rem", maxWidth: "700px", margin: "0 auto" }}>
          Your trusted platform to manage pets, owners, staff, appointments,
          treatments, medications, and billing — all in one place.
        </p>

        {/* Buttons*/}
        <div
          style={{
            marginTop: "2.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <Link to="/pets" style={buttonStyle("#007bff", "#fff")}>
            🐶 View Pets
          </Link>
          <Link to="/owners" style={buttonStyle("#6f42c1", "#fff")}>
            👤 View Owners
          </Link>
          <Link to="/staff" style={buttonStyle("#fd7e14", "#fff")}>
            👩‍⚕️ View Staff
          </Link>
          <Link to="/appointments" style={buttonStyle("#28a745", "#fff")}>
            📅 Appointments
          </Link>
          <Link to="/treatments" style={buttonStyle("#17a2b8", "#fff")}>
            💊 Treatments
          </Link>
          <Link to="/billing" style={buttonStyle("#dc3545", "#fff")}>
            💳 Billing
          </Link>
        </div>
      </section>

      {/* Features*/}
      <section
        style={{ padding: "4rem 2rem", maxWidth: "1200px", margin: "0 auto" }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "2rem",
            marginBottom: "3rem",
          }}
        >
          🌟 Key Features
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
          }}
        >
          {features.map((feature, i) => (
            <div
              key={i}
              style={{
                padding: "1.5rem",
                borderRadius: "12px",
                backgroundColor: "#f1f1f1",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: "0.95rem", color: "#555" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
const features = [
  {
    icon: "🐕",
    title: "Pet Profiles",
    description: "Track pet details, breed, age, and medical history.",
  },
  {
    icon: "📅",
    title: "Appointments",
    description: "Easily book and manage vet appointments online.",
  },
  {
    icon: "💊",
    title: "Treatments & Medications",
    description: "Assign treatments and manage prescriptions with ease.",
  },
  {
    icon: "💵",
    title: "Billing Records",
    description: "Generate and view invoices for pet services.",
  },
  {
    icon: "👩‍⚕️",
    title: "Staff Directory",
    description: "Manage clinic staff and assigned appointments.",
  },
];

//button styling
const buttonStyle = (bg, color) => ({
  backgroundColor: bg,
  color: color,
  padding: "0.75rem 1.25rem",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "1rem",
  transition: "background 0.3s ease",
});

export default Home;
