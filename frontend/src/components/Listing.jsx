import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Listing.css";

const Listing = ({ listing, showActions, onDelete }) => {
  const navigate = useNavigate();

  const handleUpdate = () => {
    navigate(`/create-listing/${listing.id}`);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/listings/${listing.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      onDelete(listing.id);
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  return (
    <div className="listing">
      <Link to={`/listing/${listing.id}`}>
        <img src={listing.picture_url} alt={listing.title} />
        <h3>{listing.title}</h3>
        <p>Price: {listing.price}€</p>
      </Link>
      {showActions && (
        <div className="listing-actions">
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default Listing;
