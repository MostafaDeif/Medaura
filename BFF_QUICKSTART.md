# BFF Quick Start Guide

## Overview

This is a complete Backend for Frontend (BFF) implementation for your Medaura Next.js application. The BFF acts as a middleware between your frontend and backend, providing:

- Type-safe API calls
- Centralized authentication
- Error handling
- Request/response transformation

## Quick Setup

### 1. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:3001
```

### 2. Start Your Backend

Make sure your backend API is running on `http://127.0.0.1:3001`

### 3. Run Next.js Development Server

```bash
npm run dev
```

Your BFF is now available at `http://localhost:3000/api/`

## Common Usage Patterns

### Authentication Flow

```typescript
// Signup
fetch("/api/auth/signup", {
  method: "POST",
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
    user_type: "patient",
    profile: { full_name: "John Doe" },
  }),
});

// Login
fetch("/api/auth/login", {
  method: "POST",
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
});

// Authenticated requests
const token = localStorage.getItem("token");
fetch("/api/user/me", {
  headers: { Authorization: `Bearer ${token}` },
});
```

### Fetching Doctors

```typescript
// Get doctors by specialty
fetch("/api/doctors/list?specialist=عظام");

// Get best doctors
fetch("/api/doctors/best");

// Get specific doctor
fetch("/api/doctors/profile?id=2");
```

### Booking a Doctor

```typescript
const token = localStorage.getItem("token");

// Get available slots
fetch(
  "/api/bookings/slots?doctor_id=2&booking_date=2026-02-22"
);

// Create booking
fetch("/api/bookings/create", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify({
    doctor_id: 2,
    booking_date: "2026-02-22",
    booking_time: "10:00",
  }),
});
```

### Clinic Management

```typescript
const token = localStorage.getItem("token");

// Create clinic
fetch("/api/clinic/", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify({
    name: "My Clinic",
    address: "123 Street",
    location: "Cairo",
    phone: "01000000000",
    email: "clinic@example.com",
    opening_hours: "9AM - 9PM",
  }),
});

// Get clinic stats
fetch("/api/clinic/stats", {
  headers: { Authorization: `Bearer ${token}` },
});

// Get clinic bookings
fetch("/api/clinic/bookings", {
  headers: { Authorization: `Bearer ${token}` },
});
```

### Ratings & Reviews

```typescript
const token = localStorage.getItem("token");

// Rate a doctor
fetch("/api/ratings/doctor?id=2", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify({
    rating: 5,
    comment: "Excellent doctor!",
  }),
});

// Get doctor ratings
fetch("/api/ratings/doctor?id=2");

// Rate clinic
fetch("/api/ratings/clinic?id=1", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify({
    rating: 4,
    comment: "Good clinic",
  }),
});
```

### Notifications

```typescript
const token = localStorage.getItem("token");

// Get notifications
fetch("/api/notifications/list", {
  headers: { Authorization: `Bearer ${token}` },
});

// Mark as read
fetch("/api/notifications/read?id=34", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
});
```

### Prescriptions

```typescript
const token = localStorage.getItem("token");

// Request access to prescription
fetch("/api/prescriptions/access?booking_id=3", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
});

// Get my prescriptions
fetch("/api/prescriptions/my-prescriptions", {
  headers: { Authorization: `Bearer ${token}` },
});
```

### Admin Functions

```typescript
const adminToken = localStorage.getItem("token");

// List doctors
fetch("/api/admin/doctors", {
  headers: { Authorization: `Bearer ${adminToken}` },
});

// List clinics
fetch("/api/admin/clinics", {
  headers: { Authorization: `Bearer ${adminToken}` },
});

// List staff
fetch("/api/admin/staff", {
  headers: { Authorization: `Bearer ${adminToken}` },
});
```

## Using with React Components

```typescript
"use client";

import { useEffect, useState } from "react";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/doctors/list?specialist=عظام")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDoctors(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {doctors.map((doctor) => (
        <div key={doctor.id}>
          <h3>{doctor.full_name}</h3>
          <p>{doctor.specialist}</p>
        </div>
      ))}
    </div>
  );
}
```

## Response Format

All endpoints return this format:

```typescript
{
  "success": true,
  "data": { /* actual data */ }
}
```

Or on error:

```typescript
{
  "success": false,
  "error": "Error message here"
}
```

## File Structure

- **`lib/api/`** - Service functions for each feature
- **`lib/types/api.ts`** - TypeScript types for all API data
- **`app/api/`** - Next.js API route handlers
- **`BFF_DOCUMENTATION.md`** - Detailed documentation
- **`.env.example`** - Environment variables template

## Next Steps

1. Update your frontend components to use `/api/` endpoints
2. Set up authentication token management (localStorage or cookies)
3. Add error boundaries for API failures
4. Implement loading states
5. Consider using a state management library (Redux, Zustand, etc.)

## Troubleshooting

**Backend connection failed?**
- Ensure backend is running on `http://127.0.0.1:3001`
- Check `.env.local` has correct `NEXT_PUBLIC_BACKEND_URL`
- Check CORS settings if using different ports

**Token issues?**
- Verify token is being passed in `Authorization: Bearer {token}` header
- Check backend token validation
- Ensure token is fresh (not expired)

**Type errors?**
- All types are in `lib/types/api.ts`
- Add new types there as you add features
- Import types from `@/lib/api`

For more details, see [BFF_DOCUMENTATION.md](./BFF_DOCUMENTATION.md)
