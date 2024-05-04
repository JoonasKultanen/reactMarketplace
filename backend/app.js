const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db.js");
const userRoutes = require("./routes/userRoutes.js");
const listingRoutes = require("./routes/listingRoutes.js");

const app = express();

require("dotenv").config();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/listings", listingRoutes);

module.exports = app;
