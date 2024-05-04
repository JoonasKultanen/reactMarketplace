const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listingController");
const verifyToken = require("../middleware/verifyToken");

router.get("/", listingController.getListings);
router.post("/", verifyToken, listingController.createListing);
router.put("/:id", verifyToken, listingController.updateListing);
router.delete("/:id", verifyToken, listingController.deleteListing);

module.exports = router;
