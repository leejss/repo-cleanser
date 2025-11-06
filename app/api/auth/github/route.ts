import { getConfig } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl = new URL(request.url).origin;
  const params = new URLSearchParams({
    client_id: getConfig("clientId"),
    redirect_uri: `${baseUrl}/api/auth/github/callback`,
    scope: "delete_repo repo",
    state: crypto.randomUUID(),
  });

  const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  return NextResponse.redirect(authUrl);
}
