import { NextRequest, NextResponse } from "next/server";
import { InterviewPrepInputSchema, InterviewPrepOutputSchema } from "@/lib/schemas";
import { generateInterviewPrepWithAI } from "@/lib/ai/engine";
import { rateLimit } from "@/lib/ai/ratelimit";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    const limit = await rateLimit(`interview-${ip}`);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = InterviewPrepInputSchema.parse(body);

    const questionsData = await generateInterviewPrepWithAI(
      validated.jobTitle,
      validated.company,
      validated.jobDescription,
      validated.resumeSkills,
      validated.questionCount
    );

    const result = InterviewPrepOutputSchema.parse(questionsData);

    return NextResponse.json({
      data: result,
    });
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    console.error("Interview prep error:", errorMsg);
    return NextResponse.json(
      { error: errorMsg || "Failed to generate interview preparation questions." },
      { status: 400 }
    );
  }
}

