import { NextResponse } from "next/server";
import { checkPostgres } from "@/lib/status";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const result = await checkPostgres();
  const status = result?.status ?? "DOWN";
  return NextResponse.json({ status }, {
    status: status === "UP" ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
