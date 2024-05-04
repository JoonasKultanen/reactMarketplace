import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import Listing from "../components/Listing.jsx";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { isLoggedIn } = useAuth();
  const userId = localStorage.getItem("userId");
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = (deletedListingId) => {
    setListings(listings.filter((listing) => listing.id !== deletedListingId));
  };

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/listings?owner=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const listingsWithFullImageUrls = data.map((listing) => ({
          ...listing,
          picture_url: `http://localhost:5000${listing.picture_url}`,
        }));
        setListings(listingsWithFullImageUrls);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchUserListings();
    }
  }, [isLoggedIn, userId]);

  if (!isLoggedIn) {
    return <div>Please log in to view your listings.</div>;
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error has occurred: {error}</div>;

  return (
    <div className="content-container">
      <h2>Your Listings</h2>
      <div className="listings-container">
        {listings.map((listing) => (
          <Listing
            key={listing.id}
            listing={listing}
            showActions={true}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
