import { getConfig } from "@/lib/config";
import { NextResponse } from "next/server";

export async function GET() {
  const params = new URLSearchParams({
    client_id: getConfig("clientId"),
    redirect_uri: "http://localhost:3000/api/auth/github/callback",
    scope: "delete_repo repo",
    state: crypto.randomUUID(),
  });

  const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  return NextResponse.redirect(authUrl);
}
