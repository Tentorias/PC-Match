import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "online",
    service: "PC-analyzer API",
    timestamp: new Date().toISOString(),
  });
}
