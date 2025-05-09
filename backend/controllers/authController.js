const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { user: { id: newUser._id } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.sign(
      { user: { id: user._id } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Optional: set cookie (for browser apps)
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false
    });

    // ✅ Also return token in response for Postman/mobile apps
    res.status(200).json({
      message: 'Login successful',
      token
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false // change to true if using HTTPS
  });

  res.status(200).json({ message: 'Logged out successfully!' });
};

module.exports = { registerUser, loginUser,logoutUser };
