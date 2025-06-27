import React from "react";
import { NavLink } from "react-router-dom";

import "./Header.css";

const Header = () => {
  return (
    <section className="h-wrapper">
      <div className="h-container">
        <NavLink to="/">
          <img src="/logo1.jpg" alt="Duncare logo" width={100} className="logo" />
        </NavLink>
      </div>

      <div className="h-menu">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/owners">Owners</NavLink>
        <NavLink to="/Pets">Pets</NavLink>
        <NavLink to="/Staff">Staff</NavLink>
        <NavLink to="/Treatments">Treatment</NavLink>
        <NavLink to="/appointments">Appointments</NavLink>
        <NavLink to="/billings">Billings</NavLink>
      </div>
    </section>
  );
};

export default Header;
