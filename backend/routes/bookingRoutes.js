const express = require("express");
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  getBookingById
} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware"); // Correct import

const router = express.Router();

router.post("/", authMiddleware, createBooking); // Use authMiddleware directly
router.get("/", authMiddleware, getUserBookings);
router.get("/:id", authMiddleware, getBookingById);
router.delete("/:id", authMiddleware, cancelBooking);

module.exports = router;