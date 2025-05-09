
# API Documentation

This is the API documentation for the Basic Activity Booking Application. The API provides endpoints to manage user registration, login, activity bookings, and more.



## Base URL
```
http://localhost:5000/api
```

## Authentication

For protected routes, you need to include a valid JWT token in the `Authorization` header as a Bearer token.

Example:

```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication API

### Register a new user
- **URL:** `http://localhost:5000/api/auth/register`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  - **200 OK:** Registration successful.
  - **400 Bad Request:** Invalid data provided.
  - **Example Response:**
    ```json
    {
      "message": "Registration successful!"
    }
    ```

---

### Login user
- **URL:** `http://localhost:5000/api/auth/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  - **200 OK:** Login successful. Returns JWT token.
  - **401 Unauthorized:** Invalid credentials.
  - **Example Response:**
    ```json
    {
      "token": "<your_jwt_token>"
    }
    ```

---

## 2. Activity API

### Get all activities
- **URL:** `http://localhost:5000/api/activities`
- **Method:** `GET`
- **Response:**
  - **200 OK:** Returns a list of all available activities.
  - **Example Response:**
    ```json
    [
      {
        "_id": "activity1_id",
        "name": "Yoga"
      },
      {
        "_id": "activity2_id",
        "name": "Zumba"
      }
    ]
    ```

---

## 3. Booking API

### Create a booking
- **URL:** `http://localhost:5000/api/bookings`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "activityId": "activity1_id",
    "date": "2025-05-15",
    "time": "10:00 AM"
  }
  ```
- **Response:**
  - **201 Created:** Booking successful.
  - **400 Bad Request:** Invalid data.
  - **401 Unauthorized:** No JWT token provided.
  - **Example Response:**
    ```json
    {
      "message": "Booking successful!"
    }
    ```

---

### Get all bookings
- **URL:** `http://localhost:5000/api/bookings`
- **Method:** `GET`
- **Response:**
  - **200 OK:** Returns all bookings of the user (requires authentication).
  - **Example Response:**
    ```json
    {
      "bookings": [
        {
          "_id": "booking1_id",
          "activity": { "name": "Yoga" },
          "date": "2025-05-15",
          "time": "10:00 AM"
        },
        {
          "_id": "booking2_id",
          "activity": { "name": "Zumba" },
          "date": "2025-05-16",
          "time": "2:00 PM"
        }
      ]
    }
    ```

---

### Delete a booking
- **URL:** `http://localhost:5000/api/bookings/:id`
- **Method:** `DELETE`
- **URL Parameters:**
  - **id (required):** The ID of the booking to cancel.
- **Response:**
  - **200 OK:** Booking successfully canceled.
  - **401 Unauthorized:** No JWT token provided.
  - **404 Not Found:** Booking not found.
  - **Example Response:**
    ```json
    {
      "message": "Booking cancelled."
    }
    ```

---

## 4. Utility Routes

### Logout user
- **URL:** `http://localhost:5000/api/auth/logout`
- **Method:** `POST`
- **Response:**
  - **200 OK:** Logs the user out by deleting the JWT token from storage (handled on the client-side).
  - **Example Response:**
    ```json
    {
      "message": "Logged out successfully!"
    }
    ```

---

## Error Handling

In case of an error, the API will return a JSON response with a `message` field describing the error.

### Common Status Codes:
- **200 OK**: Successful request.
- **201 Created**: Successful resource creation.
- **400 Bad Request**: Invalid request body or parameters.
- **401 Unauthorized**: Missing or invalid JWT token.
- **404 Not Found**: Resource not found.
- **500 Internal Server Error**: Server error.

### Error Response Example
```json
{
  "message": "Invalid credentials"
}
```


------
##### Postman link:
 https://www.postman.com/flight-cosmonaut-6449251/meetx-assignemt/collection/jkxy7i9/meetx?action=share&creator=37308591