import React from 'react'

const Home = () => {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "60vh", 
      padding: "2rem", 
      textAlign: "center" 
    }}>
      <h1>🐾 Welcome to Duncare Veterinary Record System</h1>
      <p>Manage your clinic’s pets, appointments, and records with ease.</p>
    </div>
  );
}

export default Home;
