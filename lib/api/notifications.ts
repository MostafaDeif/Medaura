import { apiClient } from "./client";
import type { Notification } from "@/lib/types/api";

export const notificationService = {
  async getMyNotifications(token: string) {
    return apiClient.get<Notification[]>("/api/notifications/me", { token });
  },

  async markAsRead(notificationId: number, token: string) {
    return apiClient.patch(
      `/api/notifications/${notificationId}/read`,
      undefined,
      { token }
    );
  },

  async markAsReadByQuery(notificationId: number, token: string) {
    return apiClient.post<Notification | any>(
      `/api/notifications/read?id=${notificationId}`,
      undefined,
      { token }
    );
  },
};
