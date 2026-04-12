// Export all services
export { apiClient, ApiClient } from "./client";
export type { FetchOptions } from "./client";

export { authService } from "./auth";
export { clinicService } from "./clinic";
export { doctorService } from "./doctors";
export { bookingService } from "./bookings";
export { ratingService } from "./ratings";
export { notificationService } from "./notifications";
export { prescriptionService } from "./prescriptions";
export { adminService } from "./admin";
export { staffService } from "./staff";

// Re-export all types
export * from "@/lib/types/api";
