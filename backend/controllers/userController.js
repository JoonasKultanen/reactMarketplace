const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db");

// Create User
exports.createUser = async (req, res) => {
  const { username, password, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (username, password, phone) VALUES (?, ?, ?)`,
      [username, hashedPassword, phone],
      function (err) {
        if (err) {
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

        // Send the token in the response
        res.status(200).json({ message: "Logged in successfully", token });
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
