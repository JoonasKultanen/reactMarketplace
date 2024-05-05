import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import ListingForm from "../components/ListingForm.jsx";
import "./CreateListingPage.css";

const CreateListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const listingId = id;
  const [listing, setListing] = useState(null);
  const { getUser } = useAuth();
  const user = getUser();
  const userId = user ? user.id : null;

  useEffect(() => {
    if (listingId) {
      fetch(`${import.meta.env.VITE_API_URL}/api/listings/${listingId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setListing(data);
        })
        .catch((error) => {
          console.error("Error fetching listing data:", error);
        });
    }
  }, [listingId]);

  const handleSubmit = (data) => {
    const token = localStorage.getItem("authToken");

    const requestOptions = {
      method: listingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    fetch(
      `${import.meta.env.VITE_API_URL}/api/listings/${listingId || ""}`,
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="create-listing-page">
      <ListingForm
        onSubmit={handleSubmit}
        editMode={!!listingId}
        listingId={listingId}
        listing={listing}
        userId={userId}
      />
    </div>
  );
};

export default CreateListingPage;
