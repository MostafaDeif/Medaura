import { apiClient } from "./client";
import type {
  AdminVerifyRequest,
  AdminDoctorsList,
  AdminClinicsList,
  AdminStaffList,
  AuditLog,
  AdminCreateRequest,
  ApiResponse,
} from "@/lib/types/api";

export const adminService = {
  async listDoctors(token: string) {
    const res = await apiClient.get<ApiResponse<AdminDoctorsList[]>>("/api/admin/doctors", { token });
    return res.data || [];
  },

  async verifyDoctor(doctorId: number, token: string) {
    return apiClient.patch(
      `/api/admin/${doctorId}/verify`,
      undefined,
      { token }
    );
  },

  async unverifyDoctor(doctorId: number, token: string) {
    return apiClient.patch(
      `/api/admin/${doctorId}/unverify`,
      undefined,
      { token }
    );
  },

  async listClinics(token: string) {
    const res = await apiClient.get<ApiResponse<AdminClinicsList[]>>("/api/admin/clinics", { token });
    return res.data || [];
  },

  async approveClinic(clinicId: number, token: string) {
    return apiClient.patch(
      `/api/admin/clinics/${clinicId}/approve`,
      undefined,
      { token }
    );
  },

  async rejectClinic(clinicId: number, token: string) {
    return apiClient.patch(
      `/api/admin/clinics/${clinicId}/reject`,
      undefined,
      { token }
    );
  },

  async listStaff(token: string) {
    const res = await apiClient.get<ApiResponse<AdminStaffList[]>>("/api/admin/staff", { token });
    return res.data || [];
  },

  async listPatients(token: string) {
    const res = await apiClient.get<ApiResponse<any[]>>("/api/admin/patients", { token });
    return res.data || [];
  },

  async listAllBookings(token: string) {
    const res = await apiClient.get<ApiResponse<any[]>>("/api/admin/bookings", { token });
    return res.data || [];
  },

  async getDashboardStats(token: string) {
    const res = await apiClient.get<ApiResponse<any>>("/api/admin/dashboard-stats", { token });
    return res.data;
  },

  async listAuditLogs(token: string) {
    const res = await apiClient.get<ApiResponse<AuditLog[]>>("/api/admin/audit-logs", { token });
    return res.data || [];
  },

  async createAdmin(data: AdminCreateRequest, token: string) {
    return apiClient.post<any>("/api/admin/create-admin", data, { token });
  },
};
