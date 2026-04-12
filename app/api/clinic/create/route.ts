import { NextRequest, NextResponse } from "next/server";
import { clinicService } from "@/lib/api/clinic";
import type { ClinicRequest } from "@/lib/types/api";

// POST /api/clinic/create
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

    const body = (await request.json()) as ClinicRequest;

    if (
      !body.name ||
      !body.address ||
      !body.location ||
      !body.phone ||
      !body.email
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const response = await clinicService.create(body, token);

    return NextResponse.json(
      { success: true, data: response },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create clinic error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create clinic",
      },
      { status: error.status || 500 }
    );
  }
}
