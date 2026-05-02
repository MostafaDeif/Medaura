import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // ✅ get token from cookies (HttpOnly)
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    console.log("TOKEN:", token);

    if (!token) {
      return Response.json(
        { success: false, error: "Unauthorized - No token" },
        { status: 401 }
      );
    }

    // ✅ get request body
    const body = await req.json();

    // ✅ IMPORTANT: تأكد من endpoint الصح
    const backendRes = await fetch("http://127.0.0.1:3001/api/clinic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...body,
        opening_hours: body.opening_hours || "10:00 - 18:00", // fallback
      }),
    });

    // ✅ نتعامل مع أي نوع response (JSON أو HTML)
    const contentType = backendRes.headers.get("content-type");

    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await backendRes.json();
    } else {
      const text = await backendRes.text();
      console.log("NON-JSON RESPONSE:", text);

      data = {
        success: false,
        error: "Invalid response from server",
        raw: text,
      };
    }

    return Response.json(data, { status: backendRes.status });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    );
  }
}