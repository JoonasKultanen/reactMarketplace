const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db.js");
const userRoutes = require("./routes/userRoutes.js");
const listingRoutes = require("./routes/listingRoutes.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/listings", listingRoutes);

module.exports = app;
