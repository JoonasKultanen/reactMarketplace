import React from "react";
import { Link } from "react-router-dom";
import "./Listing.css";

const Listing = ({ listing }) => {
  return (
    <Link to={`/listing/${listing.id}`} className="listing">
      <img src={listing.picture_url} alt={listing.title} />
      <h3>{listing.title}</h3>
      <p>Price: {listing.price}€</p>
    </Link>
  );
};

export default Listing;
