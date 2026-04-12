import { NextRequest, NextResponse } from "next/server";
import { notificationService } from "@/lib/api/notifications";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing authorization token" },
        { status: 401 }
      );
    }

    const response = await notificationService.getMyNotifications(token);
    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch notifications" },
      { status: error.status || 500 }
    );
  }
}
