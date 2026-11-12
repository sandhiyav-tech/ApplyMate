import { NextRequest, NextResponse } from "next/server";
import { InterviewFeedbackInputSchema, InterviewFeedbackOutputSchema } from "@/lib/schemas";
import { evaluateInterviewAnswerWithAI } from "@/lib/ai/engine";
import { rateLimit } from "@/lib/ai/ratelimit";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    const limit = await rateLimit(`interview-feedback-${ip}`);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = InterviewFeedbackInputSchema.parse(body);

    const feedbackData = await evaluateInterviewAnswerWithAI(
      validated.question,
      validated.type,
      validated.userAnswer,
      validated.jobTitle
    );

    const result = InterviewFeedbackOutputSchema.parse(feedbackData);

    return NextResponse.json({
      data: result,
    });
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    console.error("Interview feedback error:", errorMsg);
    return NextResponse.json(
      { error: errorMsg || "Failed to evaluate interview answer." },
      { status: 400 }
    );
  }
}

