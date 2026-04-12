import { NextRequest, NextResponse } from "next/server";
import { doctorService } from "@/lib/api/doctors";

// GET /api/doctors/best
export async function GET(request: NextRequest) {
  try {
    const response = await doctorService.getBest();

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Get best doctors error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch best doctors",
      },
      { status: error.status || 500 }
    );
  }
}
