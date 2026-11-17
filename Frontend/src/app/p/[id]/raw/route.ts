import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const url = new URL(request.url);
  const search = url.search;

  // Backend target URL (using internal, public backend URL, or localhost:3000)
  const backendBaseUrl = process.env.INTERNAL_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:3000";
  const backendRawUrl = `${backendBaseUrl}/api/v1/pastes/${id}/raw${search}`;

  try {
    const headers: Record<string, string> = {};
    const cookie = request.headers.get("cookie");
    if (cookie) {
      headers["cookie"] = cookie;
    }
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["authorization"] = authHeader;
    }

    const backendRes = await fetch(backendRawUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!backendRes.ok) {
      return new NextResponse(await backendRes.text(), {
        status: backendRes.status,
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
      });
    }

    const text = await backendRes.text();
    return new NextResponse(text, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-cache, no-store, must-revalidate",
        "x-content-type-options": "nosniff",
      },
    });
  } catch (err: unknown) {
    return new NextResponse(`Error fetching raw paste: ${(err as Error).message}`, {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
}
