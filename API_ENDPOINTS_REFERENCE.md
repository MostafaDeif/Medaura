# BFF API Endpoints Reference

## Base URL
`http://localhost:3000/api`

---

## 🔐 Authentication Endpoints

### Signup
- **POST** `/auth/signup`
- **Body**: `{ email, password, user_type, profile }`
- **Auth**: None
- **Returns**: `AuthResponse` with token

### Login
- **POST** `/auth/login`
- **Body**: `{ email, password }`
- **Auth**: None
- **Returns**: `AuthResponse` with token

### Logout
- **POST** `/auth/logout`
- **Body**: None
- **Auth**: Required (Bearer token in header)
- **Returns**: `{ success, message }`

### Refresh Token
- **POST** `/auth/refresh`
- **Body**: `{ email, password }`
- **Auth**: None
- **Returns**: `AuthResponse` with new token

### Get Current User
- **GET** `/user/me`
- **Auth**: Required
- **Returns**: `UserProfile`

---

## 👨‍⚕️ Doctor Endpoints

### List Doctors
- **GET** `/doctors/list?specialist=عظام&clinic_id=1&limit=10`
- **Query**: `specialist` (optional), `clinic_id` (optional), `limit` (optional)
- **Auth**: None
- **Returns**: `DoctorProfile[]`

### Get Best Doctors
- **GET** `/doctors/best`
- **Auth**: None
- **Returns**: `DoctorProfile[]`

### Get Doctor Profile
- **GET** `/doctors/profile?id=2`
- **Query**: `id` (required)
- **Auth**: None
- **Returns**: `DoctorProfile`

### Get Doctor Dashboard
- **GET** `/doctors/dashboard`
- **Auth**: Required
- **Returns**: `DoctorDashboard`

---

## 🏥 Clinic Endpoints

### Create Clinic
- **POST** `/clinic/create`
- **Body**: `{ name, address, location, phone, email, opening_hours }`
- **Auth**: Required
- **Returns**: `ClinicProfile`

### Get Clinic Profile
- **GET** `/clinic/profile?id=1`
- **Query**: `id` (required)
- **Auth**: None
- **Returns**: `ClinicProfile`

### Get Clinic Stats
- **GET** `/clinic/stats`
- **Auth**: Required (clinic staff)
- **Returns**: `ClinicStats`

### Get Clinic Staff
- **GET** `/clinic/staff?id=1`
- **Query**: `id` (required)
- **Auth**: None
- **Returns**: `StaffProfile[]`

### Get Clinic Bookings
- **GET** `/clinic/bookings`
- **Auth**: Required (clinic staff)
- **Returns**: `ClinicBooking[]`

### Cancel Clinic Booking
- **POST** `/clinic/bookings?id=2`
- **Query**: `id` (booking_id, required)
- **Auth**: Required
- **Returns**: `{ success, data }`

---

## 📅 Booking Endpoints

### Create Booking
- **POST** `/bookings/create`
- **Body**: `{ doctor_id, booking_date, booking_time }`
- **Auth**: Required
- **Returns**: `BookingResponse`

### Get My Bookings
- **GET** `/bookings/my-bookings`
- **Auth**: Required
- **Returns**: `BookingResponse[]`

### Get Available Slots
- **GET** `/bookings/slots?doctor_id=2&booking_date=2026-02-22`
- **Query**: `doctor_id` (required), `booking_date` (required)
- **Auth**: None
- **Returns**: `BookingSlot[]`

### Cancel Booking
- **POST** `/bookings/cancel?id=17`
- **Query**: `id` (booking_id, required)
- **Auth**: Required
- **Returns**: `{ success, data }`

---

## ⭐ Rating Endpoints

### Rate Doctor
- **POST** `/ratings/doctor?id=2`
- **Query**: `id` (doctor_id, required)
- **Body**: `{ rating, comment }`
- **Auth**: Required
- **Returns**: `RatingResponse`

### Get Doctor Ratings
- **GET** `/ratings/doctor?id=2`
- **Query**: `id` (doctor_id, required)
- **Auth**: None
- **Returns**: `RatingResponse[]`

### Rate Clinic
- **POST** `/ratings/clinic?id=1`
- **Query**: `id` (clinic_id, required)
- **Body**: `{ rating, comment }`
- **Auth**: Required
- **Returns**: `RatingResponse`

### Get Clinic Ratings
- **GET** `/ratings/clinic?id=1`
- **Query**: `id` (clinic_id, required)
- **Auth**: None
- **Returns**: `RatingResponse[]`

---

## 🔔 Notification Endpoints

### Get My Notifications
- **GET** `/notifications/list`
- **Auth**: Required
- **Returns**: `Notification[]`

### Mark Notification as Read
- **POST** `/notifications/read?id=34`
- **Query**: `id` (notification_id, required)
- **Auth**: Required
- **Returns**: `{ success, data }`

---

## 📋 Prescription Endpoints

### Request Prescription Access
- **POST** `/prescriptions/access?booking_id=3`
- **Query**: `booking_id` (required)
- **Auth**: Required
- **Returns**: `PrescriptionAccess`

### Get Prescription Access Info
- **GET** `/prescriptions/access?booking_id=3`
- **Query**: `booking_id` (required)
- **Auth**: Required
- **Returns**: `PrescriptionAccess`

### Get My Prescriptions
- **GET** `/prescriptions/my-prescriptions`
- **Auth**: Required
- **Returns**: `Prescription[]`

---

## 👥 Admin Endpoints

### Get All Doctors (Admin Only)
- **GET** `/admin/doctors`
- **Auth**: Required (admin only)
- **Returns**: `AdminDoctorsList[]`

### Get All Clinics (Admin Only)
- **GET** `/admin/clinics`
- **Auth**: Required (admin only)
- **Returns**: `AdminClinicsList[]`

### Get All Staff (Admin Only)
- **GET** `/admin/staff`
- **Auth**: Required (admin only)
- **Returns**: `AdminStaffList[]`

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 500 | Server Error |

## 🔑 Authentication

All endpoints marked "Auth: Required" need authorization header:

```
Authorization: Bearer {token}
```

## 📝 Response Format

Success:
```json
{
  "success": true,
  "data": { /* actual data */ }
}
```

Error:
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## 🔗 Quick Usage

```bash
# Get doctors
curl http://localhost:3000/api/doctors/list?specialist=عظام

# Get best doctors
curl http://localhost:3000/api/doctors/best

# Get user profile (with auth)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/user/me

# Create booking (with auth)
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"doctor_id": 2, "booking_date": "2026-02-22", "booking_time": "10:00"}' \
  http://localhost:3000/api/bookings/create
```
