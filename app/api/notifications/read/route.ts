import { NextRequest, NextResponse } from "next/server";
import { notificationService } from "@/lib/api/notifications";

// POST /api/notifications/read?id=34
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing authorization token",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("id");

    if (!notificationId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing notification ID parameter",
        },
        { status: 400 }
      );
    }

    const response = await notificationService.markAsReadByQuery(
      parseInt(notificationId),
      token
    );

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Mark notification as read error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to mark notification as read",
      },
      { status: error.status || 500 }
    );
  }
}
