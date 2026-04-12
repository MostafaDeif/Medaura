import { apiClient } from "./client";
import type { RatingRequest, RatingResponse } from "@/lib/types/api";

export const ratingService = {
  async rateDoctor(doctorId: number, data: RatingRequest, token: string) {
    return apiClient.post<RatingResponse>(
      `/api/ratings/doctor?id=${doctorId}`,
      data,
      { token }
    );
  },

  async getDoctorRatings(doctorId: number) {
    return apiClient.get<RatingResponse[]>(`/api/ratings/doctor?id=${doctorId}`);
  },

  async rateClinic(clinicId: number, data: RatingRequest, token: string) {
    return apiClient.post<RatingResponse>(
      `/api/ratings/clinic?id=${clinicId}`,
      data,
      { token }
    );
  },

  async getClinicRatings(clinicId: number) {
    return apiClient.get<RatingResponse[]>(`/api/ratings/clinic?id=${clinicId}`);
  },
};
