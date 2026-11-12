import { NextRequest, NextResponse } from "next/server";
import { AnalyzeInputSchema, FullAnalysisOutputSchema } from "@/lib/schemas";
import { analyzeFitWithAI } from "@/lib/ai/engine";
import { rateLimit } from "@/lib/ai/ratelimit";
import type { Internship } from "@/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    const limit = await rateLimit(`analyze-${ip}`);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = AnalyzeInputSchema.parse(body);

    const fullAnalysis = await analyzeFitWithAI(
      validated.resume,
      validated.internship as unknown as Internship
    );

    const result = FullAnalysisOutputSchema.parse(fullAnalysis);

    return NextResponse.json({
      data: result,
    });
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    console.error("Analysis error:", errorMsg);
    return NextResponse.json(
      { error: errorMsg || "Failed to analyze candidate fit for this role." },
      { status: 400 }
    );
  }
}
