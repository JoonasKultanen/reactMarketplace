const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const app = require("../app.js");
const request = require("supertest");

const testDbPath = path.join(__dirname, "test.db");

// Function to initialize the test database
const initializeTestDatabase = () => {
  const db = new sqlite3.Database(testDbPath, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the test database.");
  });

  // Enable foreign keys
  db.run("PRAGMA foreign_keys = ON;");

  // Create the tables
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
         id INTEGER PRIMARY KEY,
         username TEXT NOT NULL,
         password TEXT NOT NULL,
         phone TEXT NOT NULL)`
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS listings (
         id INTEGER PRIMARY KEY,
         title TEXT NOT NULL,
         description TEXT,
         price REAL NOT NULL,
         owner INTEGER,
         category TEXT,
         picture_url TEXT,
         FOREIGN KEY(owner) REFERENCES users(id))`
    );
  });

  // Close the database connection
  db.close();
};

// Function to clean up the test database
const cleanupTestDatabase = () => {
  // Delete the test database file
  fs.unlinkSync(testDbPath);
};

let userId;
let listingId;

describe("API Endpoints", () => {
  beforeAll(() => {
    // Initialize the test database before all tests
    initializeTestDatabase();
  });

  afterAll(() => {
    // Clean up the test database after all tests
    cleanupTestDatabase();
  });

  // 1. Test for user registration
  it("should register a new user", async () => {
    const newUser = {
      username: "testuser2",
      password: "testpass2",
      phone: "2222222222",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");

    userId = response.body.id;
  });

  // 2. Test for user login
  it("should login a user", async () => {
    const userCredentials = {
      username: "testuser2",
      password: "testpass2",
    };

    const response = await request(app)
      .post("/api/auth/login")
      .send(userCredentials);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  // 3. Test for user details
  it("should get user details", async () => {
    // Login to get token
    const loginResponse = await request(app).post("/api/auth/login").send({
      username: "testuser2",
      password: "testpass2",
    });

    const token = loginResponse.body.token;

    // Use token for details
    const response = await request(app)
      .get(`/api/auth/details/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .then((res) => {
        if (res.status !== 200) {
          console.log(`Unexpected status code: ${res.status}`);
          console.log(`Response body: ${JSON.stringify(res.body, null, 2)}`);
        }
        return res;
      });

    expect(response.status).toBe(200);
  });

  // 4. Test for creating a new listing
  it("should create a listing", async () => {
    // Login to get token
    const loginResponse = await request(app).post("/api/auth/login").send({
      username: "testuser2",
      password: "testpass2",
    });

    const token = loginResponse.body.token;

    // Use token to create listing
    const newListing = {
      title: "Test Listing",
      description: "This is a test listing",
      price: 100,
      owner: "1",
      category: "Electronics",
      picture_url: "http://example.com/image.jpg",
    };

    const response = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send(newListing);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");

    listingId = response.body.id;
  });

  // 5. Test for updating a listing
  it("should update a listing", async () => {
    // Login to get token
    const loginResponse = await request(app).post("/api/auth/login").send({
      username: "testuser2",
      password: "testpass2",
    });

    const token = loginResponse.body.token;

    // Use token to update listing
    const updatedListing = {
      title: "Updated Title",
      description: "Updated Description",
      price: 150,
      category: "Clothing",
      picture_url: "http://example.com/new-image.jpg",
    };

    const response = await request(app)
      .put(`/api/listings/${listingId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedListing);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Listing updated successfully"
    );
  });

  // 6. Test for deleting a listing
  it("should delete a listing", async () => {
    // Login to get token
    const loginResponse = await request(app).post("/api/auth/login").send({
      username: "testuser2",
      password: "testpass2",
    });

    const token = loginResponse.body.token;

    // Use token to delete listing
    const response = await request(app)
      .delete(`/api/listings/${listingId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Listing deleted successfully"
    );
  });
});
