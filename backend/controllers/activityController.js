const Activity = require("../models/Activity");

// Create activity
const createActivity = async (req, res) => {
  const { name, description, availableSlots, price } = req.body;

  try {
    const newActivity = new Activity({
      name,
      description,
      availableSlots,
      price
    });

    await newActivity.save();

    res.status(201).json(newActivity);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all activities
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update activity
const updateActivity = async (req, res) => {
  const { id } = req.params;
  const { name, description, availableSlots, price } = req.body;

  try {
    const activity = await Activity.findByIdAndUpdate(
      id,
      { name, description, availableSlots, price },
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json(activity);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete activity
const deleteActivity = async (req, res) => {
  const { id } = req.params;

  try {
    const activity = await Activity.findByIdAndDelete(id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createActivity,
  getActivities,
  updateActivity,
  deleteActivity
};
