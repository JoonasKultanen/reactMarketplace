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
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    owner INTEGER,
    FOREIGN KEY(owner) REFERENCES users(id))`
  );
});

module.exports = db;
