import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { FaHome, FaSignInAlt, FaUser, FaPlus } from "react-icons/fa";
import { useAuth } from "../AuthContext.jsx";
import "./Navbar.css";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__link">
        <FaHome /> Home
      </NavLink>
      {isLoggedIn && (
        <>
          <NavLink to="/create-listing" className="navbar__link">
            <FaPlus /> Create Listing
          </NavLink>
          <Dropdown>
            <Dropdown.Toggle as={NavLink} to="#" className="navbar__link">
              <FaUser />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={NavLink} to="/profile">
                Your listings
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </>
      )}
      {!isLoggedIn && (
        <NavLink to="/login" className="navbar__link navbar__right">
          <FaSignInAlt />
        </NavLink>
      )}
    </nav>
  );
};

export default Navbar;
