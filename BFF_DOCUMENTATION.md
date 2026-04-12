# Backend for Frontend (BFF) Pattern Documentation

## Overview

This project implements a Backend for Frontend (BFF) pattern that acts as a middleware layer between your Next.js frontend and the backend API. This provides several benefits:

- **Centralized API management**: Single point of control for all backend API calls
- **Type safety**: Full TypeScript support with comprehensive type definitions
- **Error handling**: Consistent error handling and response formatting
- **Authentication**: Built-in token management and authorization
- **Code reusability**: Services can be used in any part of your frontend
- **Decoupling**: Frontend is decoupled from backend API structure changes

## Directory Structure

```
lib/
├── api/
│   ├── client.ts          # API client singleton with fetch utilities
│   ├── auth.ts            # Authentication services
│   ├── clinic.ts          # Clinic-related services
│   ├── doctors.ts         # Doctor-related services
│   ├── bookings.ts        # Booking-related services
│   ├── ratings.ts         # Rating services
│   ├── notifications.ts   # Notification services
│   ├── prescriptions.ts   # Prescription services
│   ├── staff.ts           # Staff-related services
│   ├── admin.ts           # Admin services
│   └── index.ts           # Centralized exports
├── types/
│   └── api.ts             # All API type definitions

app/
├── api/
│   ├── auth/              # Authentication endpoints
│   │   ├── signup/
│   │   ├── login/
│   │   ├── logout/
│   │   └── refresh/
│   ├── user/              # User endpoints
│   │   └── me/
│   ├── clinic/            # Clinic endpoints
│   │   ├── create/
│   │   ├── profile/
│   │   ├── stats/
│   │   ├── staff/
│   │   └── bookings/
│   ├── doctors/           # Doctor endpoints
│   │   ├── list/
│   │   ├── best/
│   │   ├── profile/
│   │   └── dashboard/
│   ├── bookings/          # Booking endpoints
│   │   ├── create/
│   │   ├── my-bookings/
│   │   ├── slots/
│   │   └── cancel/
│   ├── ratings/           # Rating endpoints
│   │   ├── doctor/
│   │   └── clinic/
│   ├── notifications/     # Notification endpoints
│   │   ├── list/
│   │   └── read/
│   ├── prescriptions/     # Prescription endpoints
│   │   ├── access/
│   │   └── my-prescriptions/
│   └── admin/             # Admin endpoints
│       ├── doctors/
│       ├── clinics/
│       └── staff/
```

## Setup

### 1. Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:3001
```

### 2. The API Client

The core `ApiClient` is a singleton that handles all HTTP requests:

```typescript
import { apiClient } from "@/lib/api";

// All methods support TypeScript generics for responses
const data = await apiClient.get<YourType>("/endpoint");
const data = await apiClient.post<YourType>("/endpoint", body);
const data = await apiClient.put<YourType>("/endpoint", body);
const data = await apiClient.delete<YourType>("/endpoint");
```

**Features:**
- Automatic timeout handling (30s default)
- Authorization header injection
- JSON response parsing
- Error handling with status codes
- Configurable base URL

## Usage Examples

### In React Components (Client-side)

```typescript
"use client";

import { useState, useEffect } from "react";
import { authService, doctorService } from "@/lib/api";

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Call your BFF endpoint instead of backend directly
        const response = await fetch("/api/doctors/list?specialist=عظام");
        const data = await response.json();
        
        if (data.success) {
          setDoctors(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {doctors.map((doctor) => (
        <div key={doctor.id}>{doctor.full_name}</div>
      ))}
    </div>
  );
}
```

### Direct Service Usage

```typescript
import { doctorService, bookingService } from "@/lib/api";

// Fetch doctors with specific specialty
const doctors = await doctorService.list({ 
  specialist: "عظام",
  clinic_id: 1 
});

// Create a booking
const booking = await bookingService.create(
  {
    doctor_id: 2,
    booking_date: "2026-02-22",
    booking_time: "10:00",
  },
  authToken
);

// Get available slots
const slots = await bookingService.getAvailableSlots({
  doctor_id: 2,
  booking_date: "2026-02-22",
});
```

### Authentication

```typescript
import { authService } from "@/lib/api";

// Signup
const response = await authService.signup({
  email: "user@example.com",
  password: "password123",
  user_type: "patient",
  profile: {
    full_name: "John Doe",
  },
});

// Login
const loginResponse = await authService.login({
  email: "user@example.com",
  password: "password123",
});

// Store token in localStorage or cookies
localStorage.setItem("token", loginResponse.token);

// Logout
await authService.logout({ token: loginResponse.token });
```

### Using with Token Management

```typescript
// For authenticated requests, pass the token
const token = localStorage.getItem("token");

const userProfile = await authService.getProfile(token);
const bookings = await bookingService.getMyBookings(token);
const stats = await clinicService.getStats(token);
```

## API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh authentication token
- `GET /api/user/me` - Get current user profile

### Doctors
- `GET /api/doctors/list` - List doctors with filters
- `GET /api/doctors/best` - Get best-rated doctors
- `GET /api/doctors/profile` - Get specific doctor profile
- `GET /api/doctors/dashboard` - Get doctor dashboard

### Clinics
- `POST /api/clinic/create` - Create clinic
- `GET /api/clinic/profile` - Get clinic profile
- `GET /api/clinic/stats` - Get clinic statistics
- `GET /api/clinic/staff` - Get clinic staff
- `GET /api/clinic/bookings` - Get clinic bookings

### Bookings
- `POST /api/bookings/create` - Create booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/slots` - Get available time slots
- `POST /api/bookings/cancel` - Cancel booking

### Ratings
- `POST /api/ratings/doctor` - Rate doctor
- `GET /api/ratings/doctor` - Get doctor ratings
- `POST /api/ratings/clinic` - Rate clinic
- `GET /api/ratings/clinic` - Get clinic ratings

### Notifications
- `GET /api/notifications/list` - Get user notifications
- `POST /api/notifications/read` - Mark notification as read

### Prescriptions
- `POST /api/prescriptions/access` - Request prescription access
- `GET /api/prescriptions/access` - Get access info
- `GET /api/prescriptions/my-prescriptions` - Get user's prescriptions

### Admin
- `GET /api/admin/doctors` - List all doctors (admin only)
- `GET /api/admin/clinics` - List all clinics (admin only)
- `GET /api/admin/staff` - List all staff (admin only)

## Error Handling

The APIclient throws errors with useful information:

```typescript
try {
  const data = await apiClient.get("/endpoint");
} catch (error: any) {
  console.error("Status:", error.status);
  console.error("Message:", error.message);
  console.error("Data:", error.data);
}
```

## Response Format

All BFF endpoints return a consistent format:

```typescript
{
  success: boolean;
  data?: any;      // The actual response data
  error?: string;  // Error message if success is false
  message?: string;
}
```

## Adding New Endpoints

When your backend adds new endpoints:

1. **Add types** in `lib/types/api.ts`
2. **Create a service** in `lib/api/` (or add to existing)
3. **Create API route** in `app/api/`

Example:

```typescript
// lib/types/api.ts
export interface NewResource {
  id: number;
  name: string;
}

// lib/api/new-resource.ts
import { apiClient } from "./client";
import type { NewResource } from "@/lib/types/api";

export const newResourceService = {
  async list() {
    return apiClient.get<NewResource[]>("/api/new-resource");
  },
};

// app/api/new-resource/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import { newResourceService } from "@/lib/api/new-resource";

export async function GET(request: NextRequest) {
  try {
    const response = await newResourceService.list();
    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
}
```

## Best Practices

1. **Always use services** instead of calling `apiClient` directly in components
2. **Validate input** in route handlers before sending to backend
3. **Include auth token** for protected endpoints
4. **Handle errors** gracefully with proper user feedback
5. **Use TypeScript types** for all API requests/responses
6. **Keep services focused** on a single domain
7. **Store sensitive tokens** securely (httpOnly cookies recommended in production)

## Token Management Strategy

For production, use httpOnly cookies instead of localStorage:

```typescript
// In your API route
res.setHeader(
  "Set-Cookie",
  `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`
);
```

Then the token is automatically sent with each request.

---

This BFF pattern makes your frontend robust, maintainable, and scalable! 🚀
