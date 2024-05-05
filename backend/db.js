const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Define the path
const dbPath = path.join(__dirname, "marketplace.db");

// Create the connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the marketplace database.");
});

// Enable foreign keys
db.run("PRAGMA foreign_keys = ON;");

// Create the tables
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE)`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      owner INTEGER,
      category TEXT,
      picture_url TEXT,
      FOREIGN KEY(owner) REFERENCES users(id)
     );
     `
  );
});

// Insert a sample user
function insertSampleUser() {
  const username = "testuser";
  const password = "testpass";
  const phone = "1234567890";

  // Check if the user already exists
  const checkSql = "SELECT id FROM users WHERE username = ?;";
  db.get(checkSql, [username], (checkErr, row) => {
    if (checkErr) {
      console.error(checkErr.message);
      return;
    }

    if (!row) {
      // User does not exist, proceed with insertion
      const insertSql =
        "INSERT INTO users (username, password, phone) VALUES (?, ?, ?);";
      db.run(insertSql, [username, password, phone], function (insertErr) {
        if (insertErr) {
          console.error(insertErr.message);
          return;
        }
        console.log(`User with ID ${this.lastID} added successfully.`);
      });
    } else {
      console.log(`User with username '${username}' already exists.`);
    }
  });
}

// Fill the listings table with sample data
function processListings() {
  const listings = JSON.parse(fs.readFileSync("./listings.json", "utf8"));

  listings.forEach((listing) => {
    const { title, description, price, owner, category, picture_url } = listing;

    // Check if the listing already exists
    const checkSql =
      "SELECT id FROM listings WHERE title = ? AND description = ? AND owner = ?;";
    db.get(checkSql, [title, description, owner], (checkErr, row) => {
      if (checkErr) {
        console.error(checkErr.message);
        return;
      }

      if (!row) {
        const insertSql =
          "INSERT INTO listings (title, description, price, owner, category, picture_url) VALUES (?, ?, ?, ?, ?, ?);";
        db.run(
          insertSql,
          [title, description, price, owner, category, picture_url],
          function (insertErr) {
            if (insertErr) {
              console.error(insertErr.message);
              return;
            }
            console.log(`Listing with ID ${this.lastID} added successfully.`);
          }
        );
      } else {
        console.log(`Listing already exists with ID ${row.id}`);
      }
    });
  });
}

insertSampleUser();
processListings();

module.exports = db;
