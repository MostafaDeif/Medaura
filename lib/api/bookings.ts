import { apiClient } from "./client";
import type {
  BookingRequest,
  BookingResponse,
  BookingSlot,
  SlotsQuery,
} from "@/lib/types/api";

export const bookingService = {
  async create(data: BookingRequest, token: string) {
    return apiClient.post<BookingResponse>("/api/book", data, { token });
  },

  async getMyBookings(token: string) {
    return apiClient.get<BookingResponse[]>("/api/book/my-bookings", {
      token,
    });
  },

  async getClinicBookings(token: string, clinicId?: number) {
    const endpoint = clinicId
      ? `/api/book/clinic-bookings?clinic_id=${clinicId}`
      : "/api/book/clinic-bookings";

    return apiClient.get<BookingResponse[]>(endpoint, {
      token,
    });
  },

  async getAvailableSlots(query: SlotsQuery) {
    const params = new URLSearchParams({
      doctor_id: query.doctor_id.toString(),
      booking_date: query.booking_date,
    });

    return apiClient.get<BookingSlot[]>(
      `/api/book/slots?${params.toString()}`
    );
  },

  async cancelBooking(bookingId: number, token: string) {
    return apiClient.patch(`/api/book/${bookingId}/cancel`, undefined, {
      token,
    });
  },

  async cancelClinicBooking(bookingId: number, token: string) {
    return apiClient.patch(
      `/api/book/clinic-bookings/${bookingId}/cancel`,
      undefined,
      { token }
    );
  },
};
