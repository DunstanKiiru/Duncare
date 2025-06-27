import React from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="f-wrapper">
      <div className="f-container">
        <div className="f-left">
          <NavLink to="/">
            <img
              src="/logo1.png"
              alt="Duncare Logo"
              width={100}
              className="footer-logo"
            />
          </NavLink>
          <p className="secondaryText">
            Caring Hands For<br />
            Healthy Paws
          </p>
        </div>

        <div className="quick-links-section">
          <p className="primaryText mb-2">Quick Links</p>
          <nav className="f-menu vertical-menu">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/Pets">Pets</NavLink>
            <NavLink to="/Staff">Staff</NavLink>
            <NavLink to="/login">Login</NavLink>
          </nav>
        </div>

        <div className="contact-section">
          <p className="contactText mt-3">
            Nairobi, Kenya
            <br />
            P.O BOX 1150 - 00100
            <br />
            Email: info@Duncare.com
          </p>
        </div>
      </div>

      <div className="f-bottom text-center w-100 mt-3">
        <small className="text-muted">
          &copy; {new Date().getFullYear()} Developed by Alex Dunstan Kiiru
          Mureithi. All Rights Deserved
        </small>
      </div>
    </footer>
  );
};

export default Footer;
