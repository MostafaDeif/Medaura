import { apiClient } from "./client";
import type {
  AdminVerifyRequest,
  AdminDoctorsList,
  AdminClinicsList,
  AdminStaffList,
  AuditLog,
  AdminCreateRequest,
} from "@/lib/types/api";

export const adminService = {
  async listDoctors(token: string) {
    return apiClient.get<AdminDoctorsList[]>("/api/admin/doctors", { token });
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
    return apiClient.get<AdminClinicsList[]>("/api/admin/clinics", { token });
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
    return apiClient.get<AdminStaffList[]>("/api/admin/staff", { token });
  },

  async listAuditLogs(token: string) {
    return apiClient.get<AuditLog[]>("/api/admin/audit-logs", { token });
  },

  async createAdmin(data: AdminCreateRequest, token: string) {
    return apiClient.post<any>("/api/admin/create-admin", data, { token });
  },
};
