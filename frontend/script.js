const API_BASE = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
  updateAuthLinks();
  loadActivities();
  loadUserBookings();
});

// Update Navbar Auth Links
function updateAuthLinks() {
  const authLinks = document.getElementById('authLinks');
  const token = localStorage.getItem('token');

  if (!authLinks) return;

  authLinks.innerHTML = token
    ? `<li><a href="#" id="logoutBtn">Logout</a></li>`
    : `<li><a href="login.html">Login</a></li><li><a href="register.html">Register</a></li>`;

  document.getElementById('logoutBtn')?.addEventListener('click', logoutUser);
}

// Logout
function logoutUser(e) {
  e.preventDefault();
  localStorage.removeItem('token');
  alert('Logged out successfully!');
  window.location.href = 'index.html';
}

// Load Activities
async function loadActivities() {
  try {
    const res = await fetch(`${API_BASE}/activities`);
    const activities = await res.json();

    const activitiesList = document.getElementById('activitiesList');
    activitiesList.innerHTML = '';

    activities.forEach(({ _id, name, description, location, date }) => {
      const activityDiv = document.createElement('div');
      activityDiv.classList.add('activity');
      activityDiv.innerHTML = `
        <h3>${name}</h3>
        <p>${description}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Date:</strong> ${date}</p>
        ${
          localStorage.getItem('token')
            ? `<button class="btn" onclick="bookActivity('${_id}')">Book</button>`
            : '<p class="login-message">Login to book this activity</p>'
        }
      `;
      activitiesList.appendChild(activityDiv);
    });
  } catch (err) {
    console.error('Error loading activities:', err);
    alert('Could not load activities.');
  }
}

// Book Activity
async function bookActivity(activityId) {
  const token = localStorage.getItem('token');
  if (!token) return alert('Please login to book an activity.');

  const date = prompt('Enter booking date (YYYY-MM-DD):');
  const time = prompt('Enter time slot (e.g., 10:00 AM - 11:00 AM):');

  if (!date || !time) return alert('Date and time are required.');

  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ activityId, date, time }),
    });

    if (res.ok) {
      alert('Booking successful!');
      loadUserBookings();
    } else {
      const data = await res.json();
      alert(`Error: ${data.message}`);
    }
  } catch (err) {
    console.error('Booking error:', err);
    alert('Could not book activity.');
  }
}

// Load User Bookings
async function loadUserBookings() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    const bookingsList = document.getElementById('myBookingsList');
    bookingsList.innerHTML = '';

    if (res.ok && data.bookings?.length) {
      data.bookings.forEach(({ _id, activity, date, time }) => {
        const bookingDiv = document.createElement('div');
        bookingDiv.classList.add('booking');
        bookingDiv.innerHTML = `
          <h3>${activity.name}</h3>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <button class="btn btn-danger" onclick="deleteBooking('${_id}')">Cancel</button>
        `;
        bookingsList.appendChild(bookingDiv);
      });
    } else {
      bookingsList.innerHTML = '<p>No bookings found.</p>';
    }
  } catch (err) {
    console.error('Error loading bookings:', err);
    alert('Could not load bookings.');
  }
}

// Delete Booking
async function deleteBooking(bookingId) {
  const token = localStorage.getItem('token');
  if (!token) return alert('Please login to cancel a booking.');

  if (!confirm('Are you sure you want to cancel this booking?')) return;

  try {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      alert('Booking cancelled.');
      loadUserBookings();
    } else {
      const data = await res.json();
      alert(`Error: ${data.message}`);
    }
  } catch (err) {
    console.error('Error cancelling booking:', err);
    alert('Could not cancel booking.');
  }
}