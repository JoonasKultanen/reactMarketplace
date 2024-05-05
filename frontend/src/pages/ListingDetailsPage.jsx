import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ListingDetailsPage.css";

const ListingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = React.useState(null);

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/listings/${id}`
        );
        const data = await response.json();
        const fullImageUrl = `${import.meta.env.VITE_API_URL}${
          data.picture_url
        }`;
        setListing({ ...data, picture_url: fullImageUrl });
      } catch (error) {
        console.error("Error fetching listing details:", error);
        navigate("/");
      }
    };

    fetchListingDetails();
  }, [id, navigate]);

  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="listing-details">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
      <div className="listing-image">
        <img src={listing.picture_url} alt={listing.title} />
      </div>
      <div className="listing-info">
        <h2>{listing.title}</h2>
        <p>{listing.description}</p>
        <p>Price: {listing.price}€</p>
        <h3>Owner Information</h3>
        <p>Name: {listing.owner.name}</p>
        <p>Phone: {listing.owner.phone}</p>
      </div>
    </div>
  );
};

export default ListingDetailsPage;
