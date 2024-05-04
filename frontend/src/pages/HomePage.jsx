import React, { useState, useEffect } from "react";
import CategoryButton from "../components/CategoryButton.jsx";
import Listing from "../components/Listing.jsx";
import {
  faCouch,
  faTv,
  faShirt,
  faCar,
  faSeedling,
  faPaw,
  faFootball,
} from "@fortawesome/free-solid-svg-icons";
import "./HomePage.css";

const HomePage = () => {
  const categories = [
    { name: "Furniture", icon: faCouch },
    { name: "Electronics", icon: faTv },
    { name: "Clothing", icon: faShirt },
    { name: "Cars", icon: faCar },
    { name: "Home & Garden", icon: faSeedling },
    { name: "Pets & Supplies", icon: faPaw },
    { name: "Sports & Outdoors", icon: faFootball },
  ];

  const [listings, setListings] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const fetchListings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/listings");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching listings:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAndSetListings = async () => {
      const data = await fetchListings();
      const listingsWithFullImageUrls = data.map((listing) => ({
        ...listing,
        picture_url: `http://localhost:5000${listing.picture_url}`,
      }));
      setListings(listingsWithFullImageUrls);
    };

    fetchAndSetListings();
  }, []);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(categoryName)) {
        return prevCategories.filter((category) => category !== categoryName);
      } else {
        return [...prevCategories, categoryName];
      }
    });
  };

  const filteredListings = listings.filter((listing) => {
    if (selectedCategories.length === 0) {
      return true;
    } else {
      return selectedCategories.includes(listing.category);
    }
  });

  return (
    <div className="home-page">
      <h2>What are you looking for?</h2>
      <div className="categories-container">
        {categories.map((category, index) => (
          <CategoryButton
            key={index}
            categoryName={category.name}
            icon={category.icon}
            onClick={handleCategoryClick}
            isSelected={selectedCategories.includes(category.name)}
          />
        ))}
      </div>
      <h2>All Listings</h2>
      <div className="listings-container">
        {filteredListings.map((listing, index) => (
          <Listing key={index} listing={listing} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
