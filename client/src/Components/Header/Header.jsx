import React from "react";
import { NavLink } from "react-router-dom";

import "./Header.css";

const Header = () => {
  return (
    <section className="h-wrapper">
      <div className="h-container">
        <NavLink to="/">
          <img src="/logo1.lpg" alt="MIS logo" width={100} className="logo" />
        </NavLink>
      </div>

      <div className="h-menu">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/waterassets">Assets</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/login" className="btn btn-outline-primary mt-2">
          Login
        </NavLink>
      </div>
    </section>
  );
};

export default Header;
