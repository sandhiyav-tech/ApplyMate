import { NextRequest, NextResponse } from "next/server";
import { SaveAnalysisInputSchema } from "@/lib/schemas";
import { fetchUserAnalyses, storeAnalysis } from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo-user";

    const saved = await fetchUserAnalyses(userId);
    return NextResponse.json({ analyses: saved });
  } catch (err: any) {
    console.error("Fetch analyses error:", err);
    return NextResponse.json(
      { error: "Failed to fetch saved analyses" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const body = await req.json();
    const validated = SaveAnalysisInputSchema.parse(body);

    const saved = await storeAnalysis({
      ...validated,
      userId,
    });

    return NextResponse.json({
      success: true,
      data: saved,
    });
  } catch (err: any) {
    console.error("Save analysis error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to save analysis" },
      { status: 400 }
    );
  }
}
