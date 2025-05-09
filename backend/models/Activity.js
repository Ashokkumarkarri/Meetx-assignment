const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  availableSlots: { type: Number, required: true },
  price: { type: Number, required: true },
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
