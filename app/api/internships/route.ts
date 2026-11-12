import { NextRequest, NextResponse } from "next/server";
import { fetchAllInternships } from "@/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;

    const data = await fetchAllInternships({ category, search });

    return NextResponse.json({
      internships: data,
      count: data.length,
    });
  } catch (err: any) {
    console.error("Fetch internships error:", err);
    return NextResponse.json(
      { error: "Failed to fetch internships" },
      { status: 500 }
    );
  }
}

