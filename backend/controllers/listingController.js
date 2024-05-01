// Create Listing
exports.createListing = (req, res) => {
  const { title, description, price, owner } = req.body;
  const userId = req.user.id;
  const db = require("../db");

  db.run(
    `INSERT INTO listings (title, description, price, owner) VALUES (?, ?, ?, ?)`,
    [title, description, price, owner],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
};

// Update Listing
exports.updateListing = (req, res) => {
  const { title, description, price } = req.body;
  const listingId = req.params.id;
  const db = require("../db");

  db.get(
    `SELECT * FROM listings WHERE id = ?`,
    [listingId],
    async (err, row) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: "Listing not found" });
      }

      const currentUserId = req.user.id;

      if (row.owner !== currentUserId) {
        return res
          .status(403)
          .json({ error: "You do not have permission to update this listing" });
      }

      db.run(
        `UPDATE listings SET title = ?, description = ?, price = ? WHERE id = ?`,
        [title, description, price, listingId],
        function (err) {
          if (err) {
            return res.status(400).json({ error: err.message });
          }
          res.status(200).json({ message: "Listing updated successfully" });
        }
      );
    }
  );
};

// Delete Listing
exports.deleteListing = (req, res) => {
  const listingId = req.params.id;
  const db = require("../db");

  db.get(
    `SELECT * FROM listings WHERE id = ?`,
    [listingId],
    async (err, row) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: "Listing not found" });
      }

      const currentUserId = req.user.id;

      if (row.owner !== currentUserId) {
        return res
          .status(403)
          .json({ error: "You do not have permission to delete this listing" });
      }

      db.run(`DELETE FROM listings WHERE id = ?`, [listingId], function (err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        res.status(200).json({ message: "Listing deleted successfully" });
      });
    }
  );
};
