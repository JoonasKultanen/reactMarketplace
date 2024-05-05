const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db");
const express = require("express");
const app = express();

app.use(express.json());

// Create User
exports.createUser = async (req, res) => {
  const { username, password, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (username, password, phone) VALUES (?,?,?)`,
      [username, hashedPassword, phone],
      function (err) {
        if (err) {
          // Check if the error is due to a taken username or phone number
          if (err.code === "SQLITE_CONSTRAINT") {
            return res
              .status(400)
              .json({ error: "Username or phone number is already taken." });
          }
          return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  try {
    db.get(
      `SELECT * FROM users WHERE username = ?`,
      [username],
      async (err, row) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        if (!row) {
          return res
            .status(401)
            .json({ error: "Invalid username or password" });
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, row.password);
        if (!passwordMatch) {
          return res
            .status(401)
            .json({ error: "Invalid username or password" });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: row.id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        // Include user details in the response
        const userDetails = {
          id: row.id,
          username: row.username,
          phone: row.phone,
        };

        // Send the token and user details in the response
        res.status(200).json({
          message: "Logged in successfully",
          token,
          user: userDetails,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user details
exports.getUserDetails = (req, res) => {
  const userId = req.params.userId;
  try {
    db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, row) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(row);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
