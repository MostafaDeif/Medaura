import { NextRequest, NextResponse } from "next/server";
import { notificationService } from "@/lib/api/notifications";

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing authorization token" },
        { status: 401 }
      );
    }

    const segments = request.nextUrl.pathname.split("/").filter(Boolean);
    const notificationId = segments[segments.length - 2];

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: "Missing notification ID" },
        { status: 400 }
      );
    }

    const response = await notificationService.markAsRead(
      parseInt(notificationId),
      token
    );
    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Mark notification as read error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to mark as read" },
      { status: error.status || 500 }
    );
  }
}
