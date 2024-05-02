import React from "react";
import { NavLink } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { FaHome, FaSignInAlt, FaUser } from "react-icons/fa";
import { useAuth } from "../AuthContext.jsx";
import "./Navbar.css";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__link">
        <FaHome /> Home
      </NavLink>
      {isLoggedIn ? (
        <Dropdown>
          <Dropdown.Toggle as={NavLink} to="#" className="navbar__link">
            <FaUser />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item as={NavLink} to="/profile">
              Profile
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                logout();
              }}
            >
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <NavLink to="/login" className="navbar__link navbar__right">
          <FaSignInAlt />
        </NavLink>
      )}
    </nav>
  );
};

export default Navbar;
