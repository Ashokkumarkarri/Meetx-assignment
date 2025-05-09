const Booking = require("../models/Booking");
const Activity = require("../models/Activity");
const moment = require("moment");

// Create booking
const createBooking = async (req, res) => {
  const userId = req.user.id;
  const { activityId, bookingDate, timeSlot } = req.body;

  // Check if timeSlot is missing
  if (!timeSlot) {
    return res.status(400).json({ message: 'Time slot is required' });
  }

  try {
    // Validate the booking date
    if (moment(bookingDate).isBefore(moment(), 'day')) {
      return res.status(400).json({ message: 'Cannot book for a past date' });
    }

    // Validate the timeSlot format
    const timeSlotPattern = /\d{1,2}:\d{2} [APap][Mm] - \d{1,2}:\d{2} [APap][Mm]/;
    if (!timeSlot.match(timeSlotPattern)) {
      return res.status(400).json({ message: 'Invalid time slot format' });
    }

    // Find the activity
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (activity.availableSlots <= 0) {
      return res.status(400).json({ message: "No slots available" });
    }

    // Decrease available slot
    activity.availableSlots -= 1;
    await activity.save();

    // Create the booking
    const booking = new Booking({
      user: userId,
      activity: activityId,
      bookingDate,  // Use bookingDate here instead of date
      timeSlot
    });

    await booking.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get user bookings
const getUserBookings = async (req, res) => {
  const userId = req.user.id;

  try {
    const bookings = await Booking.find({ user: userId }).populate("activity");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Cancel booking
// Cancel booking
const cancelBooking = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Find the booking
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure the booking belongs to the user
    if (booking.user.toString() !== userId) {
      return res.status(403).json({ message: 'You can only cancel your own bookings' });
    }

    // Increase available slots for the activity
    const activity = await Activity.findById(booking.activity);
    activity.availableSlots += 1;
    await activity.save();

    // Delete the booking
    await booking.deleteOne(); // Changed from booking.remove()

    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get specific booking
const getBookingById = async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;

  try {
    const booking = await Booking.findById(bookingId).populate("activity");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Ensure the booking belongs to the logged-in user
    if (booking.user.toString() !== userId) {
      return res.status(403).json({ message: "Access denied: Not your booking" });
    }

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking,getBookingById
};
