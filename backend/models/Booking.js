const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Ensure the reference to the User model is correct
    required: true
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',  // Ensure the reference to the Activity model is correct
    required: true
  },
  bookingDate: {
    type: Date,
    required: true
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
