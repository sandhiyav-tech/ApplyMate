import { NextRequest, NextResponse } from "next/server";
import { MatchInputSchema } from "@/lib/schemas";
import { fetchAllInternships } from "@/db";
import { calculateInternshipMatch } from "@/lib/ai/engine";
import { rateLimit } from "@/lib/ai/ratelimit";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    const limit = await rateLimit(`match-${ip}`);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = MatchInputSchema.parse(body);

    const availableInternships = await fetchAllInternships({
      category: validated.category || undefined,
      search: validated.search || undefined,
    });

    const ranked = availableInternships.map((internship) => {
      const match = calculateInternshipMatch(validated.resume, internship);
      return {
        ...internship,
        matchPercentage: match.matchPercentage,
        matchDetails: match,
      };
    });

    // Sort descending by match percentage
    ranked.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));

    return NextResponse.json({
      internships: ranked,
      totalCount: ranked.length,
    });
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    console.error("Match error:", errorMsg);
    return NextResponse.json(
      { error: errorMsg || "Failed to match internships against resume." },
      { status: 400 }
    );
  }
}

