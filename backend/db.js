const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcrypt");

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

async function insertSampleUser() {
  const username = "testuser";
  const password = "testpass";
  const phone = "1234567890";
  let hashedPassword;

  // Check if the user already exists
  const checkUserExists = new Promise((resolve, reject) => {
    const checkSql = "SELECT id FROM users WHERE username = ?;";
    db.get(checkSql, [username], (checkErr, row) => {
      if (checkErr) {
        reject(checkErr);
      } else {
        resolve(row);
      }
    });
  });

  // Check if the phone number already exists
  const checkPhoneExists = new Promise((resolve, reject) => {
    const checkSql = "SELECT id FROM users WHERE phone = ?;";
    db.get(checkSql, [phone], (checkErr, row) => {
      if (checkErr) {
        reject(checkErr);
      } else {
        resolve(row);
      }
    });
  });

  try {
    const userExists = await checkUserExists;
    const phoneExists = await checkPhoneExists;

    if (!userExists && !phoneExists) {
      // User and phone number do not exist, proceed with insertion
      hashedPassword = await bcrypt.hash(password, 10);

      const insertSql =
        "INSERT INTO users (username, password, phone) VALUES (?, ?, ?);";
      db.run(
        insertSql,
        [username, hashedPassword, phone],
        function (insertErr) {
          if (insertErr) {
            console.error(insertErr.message);
            return;
          }
          console.log(`User with ID ${this.lastID} added successfully.`);
        }
      );
    } else {
      if (userExists) {
        console.log(`User with username '${username}' already exists.`);
      }
      if (phoneExists) {
        console.log(`Phone number '${phone}' is already in use.`);
      }
    }
  } catch (error) {
    console.error(
      "Error checking user or inserting sample user:",
      error.message
    );
  }
}

// Fill the listings table with sample data
async function processListings() {
  const listings = JSON.parse(fs.readFileSync("./listings.json", "utf8"));

  // Use map to create an array of promises
  const promises = listings.map(async (listing) => {
    const { title, description, price, owner, category, picture_url } = listing;

    // Ensure the owner exists before inserting the listing
    const checkOwnerExists = new Promise((resolve, reject) => {
      const checkSql = "SELECT id FROM users WHERE id = ?;";
      db.get(checkSql, [owner], (checkErr, row) => {
        if (checkErr) {
          reject(checkErr);
        } else {
          resolve(row);
        }
      });
    });

    try {
      const row = await checkOwnerExists;
      if (row) {
        const insertSql =
          "INSERT INTO listings (title, description, price, owner, category, picture_url) VALUES (?, ?, ?, ?, ?, ?);";
        return new Promise((resolve, reject) => {
          db.run(
            insertSql,
            [title, description, price, owner, category, picture_url],
            function (insertErr) {
              if (insertErr) {
                console.error(insertErr.message);
                reject(insertErr);
              } else {
                console.log(
                  `Listing with ID ${this.lastID} added successfully.`
                );
                resolve();
              }
            }
          );
        });
      } else {
        console.error(`Owner with ID ${owner} does not exist.`);
        throw new Error(`Owner with ID ${owner} does not exist.`);
      }
    } catch (error) {
      console.error(
        "Error checking owner or inserting listing:",
        error.message
      );
      throw error;
    }
  });

  // Wait for all promises to resolve
  try {
    await Promise.all(promises);
  } catch (error) {
    console.error("Error processing listings:", error.message);
  }
}

async function main() {
  try {
    // Wait for a sample user to be inserted
    await insertSampleUser();
    // Insert sample listings
    await processListings();
  } catch (error) {
    console.error(
      "Error inserting sample user or processing listings:",
      error.message
    );
  }
}

main();

module.exports = db;
