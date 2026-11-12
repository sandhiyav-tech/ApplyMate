import { NextRequest, NextResponse } from "next/server";
import { RoadmapInputSchema, LearningRoadmapSchema } from "@/lib/schemas";
import { generateRoadmapWithAI } from "@/lib/ai/engine";
import { rateLimit } from "@/lib/ai/ratelimit";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    const limit = await rateLimit(`roadmap-${ip}`);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = RoadmapInputSchema.parse(body);

    const roadmapData = await generateRoadmapWithAI(
      validated.targetRole,
      validated.missingSkills,
      validated.currentSkills,
      validated.durationWeeks
    );

    const result = LearningRoadmapSchema.parse(roadmapData);

    return NextResponse.json({
      data: result,
    });
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    console.error("Roadmap error:", errorMsg);
    return NextResponse.json(
      { error: errorMsg || "Failed to generate learning roadmap." },
      { status: 400 }
    );
  }
}

