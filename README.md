# Appointment Booking App

A full-stack appointment booking platform where patients can register, login, view available slots, and book an appointment. Admins can see all bookings.

---

## Live Links

- **Frontend (Vercel):** [Appointment Booking Frontend](https://appointment-booking-orcin.vercel.app)
- **Backend (Render):** [Appointment Booking API](https://appointmentbooking-976o.onrender.com)
- **Repository:** [GitHub - VanshNyati/AppointmentBooking](https://github.com/VanshNyati/AppointmentBooking)

---

## Tech Stack

- **Frontend:** React + Vite + React Router + TailwindCSS  
- **Backend:** Node.js + Express  
- **Database:** MongoDB Atlas  
- **Auth:** JWT (Bearer token via `Authorization` header)  
- **Hosting:** Vercel (Frontend), Render (Backend)  

---

## API Endpoints

Base URL: `<API_URL>/api`

### Auth

- **POST** `/register`  
  Body: `{ name, email, password }`  
  Response: `201 Created`

- **POST** `/login`  
  Body: `{ email, password }`  
  Response: `200 OK` → `{ token, role }`

### Slots

- **GET** `/slots?from=YYYY-MM-DD&to=YYYY-MM-DD`  
  Response: `200 OK`  

  ```json
  {
    "available": [
      { "id": "slotId", "start_at": "2025-08-21T09:00", "end_at": "2025-08-21T09:30" }
    ]
  }
   ```

---

### Booking

- **POST** `/book` (Auth: patient)  
  Body: `{ slotId }`  
  Response: `201 Created`

- **GET** `/my-bookings` (Auth: patient) → `200 OK`

- **GET** `/all-bookings` (Auth: admin) → `200 OK`

---

### Error Shape

```json
{
  "error": {
    "code": "SLOT_TAKEN",
    "message": "Slot already booked"
  }
}
```

---

## Setup Instructions

1. **Clone the repository**

   ```sh
   git clone https://github.com/VanshNyati/AppointmentBooking.git
   cd AppointmentBooking
   ```

2. **Install dependencies**

   ```sh
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Environment Variables**

   ```sh
   # backend/.env
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

   ```sh
   # frontend/.env
   VITE_API_URL=<your_backend_api_url>
   ```

4. **Run locally**

   ```sh
   # Start backend
   cd backend && npm run dev
   ```

   ```sh
   # Start frontend
   cd frontend && npm run dev
   ```

5. **Deployment Notes**

    Deploy backend first (Render) → copy the API URL \
    Update frontend/.env with VITE_API_URL=<backend_url> \
    Then deploy frontend (Vercel) \
    This avoids CORS issues

---

## Features

- ✅ User authentication (JWT-based)
- ✅ Role-based access (Patient / Admin)
- ✅ Patients can view available slots and book appointments
- ✅ Patients can view their own bookings
- ✅ Admins can view all bookings
- ✅ Fully responsive UI with TailwindCSS
- ✅ CORS handled for frontend–backend deployment

---

## Future Improvements

- 🔹 Add appointment cancellation & rescheduling
- 🔹 Add email/SMS notifications for bookings
- 🔹 Calendar integration (Google Calendar, Outlook)
- 🔹 Doctor-specific slots instead of global
- 🔹 Pagination & filtering for bookings

---

## Contributing

1. Fork the repo  
2. Create your feature branch:  

   ```sh
   git checkout -b feature/YourFeature
   ```

3. Commit your changes:

   ```sh  
   git commit -m "Add new feature"
   ```

4. Push to the branch:

   ```sh
   git push origin feature/YourFeature
   ```

5. Open a Pull Request 🎉

---

## 🏗️ Architecture Notes

This project is designed with a clean **separation of concerns** between frontend, backend, and database layers.

### 📂 1. Folder Structure

- **`/backend`** → Node.js + Express REST API  
  - **`routes/`** → Defines endpoints (`auth`, `slots`, `bookings`)  
  - **`models/`** → Mongoose schemas for `User`, `Slot`, and `Booking`  
  - **`middleware/`** → `authMiddleware.js` for JWT validation & role-based access  
  - **`controllers/`** → Business logic for authentication, slot management, booking  
  - **`server.js`** → App entrypoint  

- **`/frontend`** → React (Vite) + TailwindCSS  
  - **`pages/`** → Screens (`Login`, `Register`, `Slots`, `MyBookings`, `AdminDashboard`)  
  - **`components/`** → Shared UI (Navbar, BookingCard, Loader)  
  - **`context/`** → Auth context (JWT persistence in localStorage)  
  - **`App.jsx`** → Router setup (protected routes based on user role)  

---

### 🔐 2. Authentication & RBAC

- **JWT-based authentication**:  
  - Tokens issued on `/login`, signed with `JWT_SECRET`, expire in 24h.  
  - Sent via `Authorization: Bearer <token>` header.  

- **Role-based Access Control (RBAC):**  
  - **Patients** → Can book and view their own bookings.  
  - **Admin** → Can view all bookings.  
  - Enforced via middleware (`requireRole('admin')`).  

---

### 📅 3. Booking & Slot Management

- Slots are fetched from `/slots?from=YYYY-MM-DD&to=YYYY-MM-DD`.  

- **Booking workflow:**  
  1. Patient sends `{ slotId }` to `/book`.  
  2. Backend validates token → checks slot availability.  
  3. If slot already booked, returns:  

     ```json
     { "error": { "code": "SLOT_TAKEN", "message": "Slot already booked" } }
     ```  

  4. Otherwise, creates a `Booking` entry linked to user + slot.  

- **Atomicity / Double Booking Prevention**:  
  - Ensured at DB level by checking if a `Booking` already exists for the same `slotId` before insertion.  

---

### ⚠️ 4. Error Handling

- All API responses follow a **consistent error shape**:  

  ```json
  { "error": { "code": "ERROR_CODE", "message": "Readable error message" } }

---

### 🛡️ 5. Security Practices

- Passwords are hashed with **bcrypt** before storing in MongoDB.  
- JWT secret and DB connection string stored in `.env` (never committed).  
- CORS configured to allow only frontend origin.  
- Sensitive fields like passwords are excluded from responses using Mongoose `.select('-password')`.  

---

## ✅ Verification & Testing

You can test the API locally or against the deployed Render backend using tools like **curl** or **Postman**.

### 1. Register a new patient

```sh
curl -X POST <API_URL>/api/register \
  -H "Content-Type: application/json" \
  -d '{ "name": "John Doe", "email": "john@example.com", "password": "secret123" }'
```

### 2. Login and get JWT token

```sh
curl -X POST <API_URL>/api/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "john@example.com", "password": "secret123" }'
```

Response:

```json
{ "token": "jwt_token_here", "role": "patient" }
```

### 3. Fetch available slots

```sh
curl -X GET "<API_URL>/api/slots?from=2025-08-21&to=2025-08-22" \
  -H "Authorization: Bearer <jwt_token_here>"
```

### 4. Book a slot

```sh
curl -X POST <API_URL>/api/book \
  -H "Authorization: Bearer <jwt_token_here>" \
  -H "Content-Type: application/json" \
  -d '{ "slotId": "64df22..." }'
```

### 5. Get my bookings (patient)

```sh
curl -X GET <API_URL>/api/my-bookings \
  -H "Authorization: Bearer <jwt_token_here>"
```

### 6. Get all bookings (admin only)

```sh
curl -X GET <API_URL>/api/all-bookings \
  -H "Authorization: Bearer <admin_jwt_token>"
```

---

## 🧪 Running Tests (Optional)

If you add Jest/Supertest in the future:

```sh
# inside backend
npm run test
