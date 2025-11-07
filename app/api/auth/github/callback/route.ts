import { getConfig } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: getConfig("clientId"),
      client_secret: getConfig("clientSecret"),
      code,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const accessToken = data.access_token;

  const cookieStore = await cookies();
  cookieStore.set("github_access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // CSRF 방어
    maxAge: 30 * 24 * 60 * 60, // 30일
    path: "/",
  });

  return NextResponse.redirect(new URL("/", request.url));
}
