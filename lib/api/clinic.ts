import { apiClient } from "./client";
import type {
  ClinicRequest,
  ClinicProfile,
  ClinicStats,
  ClinicBooking,
  BookingRequest,
  BookingResponse,
  StaffProfile,
} from "@/lib/types/api";

export const clinicService = {
  async create(data: ClinicRequest, token: string) {
    return apiClient.post<ClinicProfile>("/api/clinic", data, { token });
  },

  async getProfile(clinicId: number) {
    return apiClient.get<ClinicProfile>(`/api/clinic/profile?id=${clinicId}`);
  },

  async updateProfile(clinicId: number, data: Partial<ClinicRequest>, token: string) {
    return apiClient.put<ClinicProfile>(
      `/api/clinic/${clinicId}`,
      data,
      { token }
    );
  },

  async getStats(token: string) {
    return apiClient.get<ClinicStats>("/api/clinic/stats", { token });
  },

  async getStaff(token: string) {
    return apiClient.get<StaffProfile[]>("/api/clinic/staff", { token });
  },

  async getBookings(token: string, clinicId?: number) {
    const endpoint = clinicId
      ? `/api/clinic/bookings?clinic_id=${clinicId}`
      : "/api/clinic/bookings";

    return apiClient.get<ClinicBooking[]>(endpoint, { token });
  },

  async createBooking(data: BookingRequest, token: string) {
    return apiClient.post<BookingResponse>("/api/clinic/bookings", data, {
      token,
    });
  },
};
