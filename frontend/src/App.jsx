import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ListingDetailsPage from "./pages/ListingDetailsPage.jsx";
import CreateListingPage from "./pages/CreateListingPage.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/listing/:id" element={<ListingDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/create-listing/:id?" element={<CreateListingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
