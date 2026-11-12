import { NextRequest, NextResponse } from "next/server";
import { CoverLetterInputSchema, CoverLetterOutputSchema } from "@/lib/schemas";
import { generateCoverLetterWithAI } from "@/lib/ai/engine";
import { rateLimit } from "@/lib/ai/ratelimit";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    const limit = await rateLimit(`cover-letter-${ip}`);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = CoverLetterInputSchema.parse(body);

    const result = await generateCoverLetterWithAI(
      validated.resume,
      validated.jobTitle,
      validated.company,
      validated.jobDescription,
      validated.tone,
      validated.customNotes
    );

    const validatedOutput = CoverLetterOutputSchema.parse(result);

    return NextResponse.json({
      data: validatedOutput,
    });
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    console.error("Cover letter error:", errorMsg);
    return NextResponse.json(
      { error: errorMsg || "Failed to generate cover letter." },
      { status: 400 }
    );
  }
}

