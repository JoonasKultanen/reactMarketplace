const fs = require("fs").promises;
const path = require("path");
const db = require("../db.js");

// Path to the listings.json file
const jsonFilePath = path.join(__dirname, "..", "listings.json");

// Function to insert a single listing into the database
function insertListing(listing) {
  return new Promise((resolve, reject) => {
    const { title, description, price, owner, category, picture_url } = listing;
    db.run(
      `INSERT INTO listings (title, description, price, owner, category, picture_url) VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, price, owner, category, picture_url],
      function (err) {
        if (err) {
          reject(err);
        } else {
          console.log(`Listing inserted with rowid ${this.lastID}`);
          resolve();
        }
      }
    );
  });
}

// Read and process the listings.json file
async function loadListings() {
  try {
    const data = await fs.readFile(jsonFilePath, "utf8");
    const listings = JSON.parse(data);
    await Promise.all(listings.map(insertListing));
  } catch (error) {
    console.error("Error reading JSON file or inserting listings:", error);
  } finally {
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Close the database connection.");
    });
  }
}

loadListings();
