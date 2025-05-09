const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5000', // Replace with your frontend URL
  credentials: true, // Allow cookies
}));
app.use(express.json());
app.use(cookieParser()); // Parse cookies

// Test Route
app.get("/", (req, res) => {
  res.send("MeetX Booking API is running...");
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/bookings', bookingRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB', err));

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});