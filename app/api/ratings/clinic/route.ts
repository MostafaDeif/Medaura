import { NextRequest, NextResponse } from "next/server";
import { ratingService } from "@/lib/api/ratings";
import type { RatingRequest } from "@/lib/types/api";

// POST /api/ratings/clinic?id=1
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
    const clinicId = searchParams.get("id");

    if (!clinicId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing clinic ID parameter",
        },
        { status: 400 }
      );
    }

    const body = (await request.json()) as RatingRequest;

    if (!body.rating) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field: rating",
        },
        { status: 400 }
      );
    }

    const response = await ratingService.rateClinic(
      parseInt(clinicId),
      body,
      token
    );

    return NextResponse.json(
      { success: true, data: response },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Rate clinic error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to rate clinic",
      },
      { status: error.status || 500 }
    );
  }
}

// GET /api/ratings/clinic?id=1
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("id");

    if (!clinicId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing clinic ID parameter",
        },
        { status: 400 }
      );
    }

    const response = await ratingService.getClinicRatings(parseInt(clinicId));

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Get clinic ratings error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch clinic ratings",
      },
      { status: error.status || 500 }
    );
  }
}
