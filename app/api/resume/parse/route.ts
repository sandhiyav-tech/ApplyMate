import { NextRequest, NextResponse } from "next/server";
import { parsePdfBuffer } from "@/lib/parsers/pdf";
import { parseDocxBuffer } from "@/lib/parsers/docx";
import { generateResumeHash, getCachedResume, setCachedResume } from "@/lib/parsers/cache";
import { parseResumeWithAI } from "@/lib/ai/engine";
import { rateLimit } from "@/lib/ai/ratelimit";
import { ParsedResumeSchema } from "@/lib/schemas";

export const maxDuration = 60;

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    const limit = await rateLimit(`resume-parse-${ip}`);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429, headers: { "Retry-After": limit.reset.toString() } }
      );
    }

    let extractedText = "";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const textParam = formData.get("text") as string | null;

      if (file && file.size > 0) {
        if (file.size > MAX_FILE_SIZE_BYTES) {
          return NextResponse.json(
            { error: "File size exceeds the 5 MB limit. Please upload a smaller file." },
            { status: 400 }
          );
        }

        const fileName = file.name.toLowerCase();
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (fileName.endsWith(".pdf") || file.type === "application/pdf") {
          extractedText = await parsePdfBuffer(buffer);
        } else if (
          fileName.endsWith(".docx") ||
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          extractedText = await parseDocxBuffer(buffer);
        } else {
          return NextResponse.json(
            { error: "Invalid file format. Only PDF and DOCX files are supported." },
            { status: 400 }
          );
        }
      } else if (textParam) {
        extractedText = textParam;
      }
    } else {
      const json = await req.json();
      if (json.text) {
        extractedText = json.text;
      } else if (json.fileBase64) {
        const buffer = Buffer.from(json.fileBase64, "base64");
        if (buffer.length > MAX_FILE_SIZE_BYTES) {
          return NextResponse.json(
            { error: "File exceeds 5 MB limit" },
            { status: 400 }
          );
        }
        const name = (json.fileName || "").toLowerCase();
        if (name.endsWith(".docx") || json.mimeType?.includes("word")) {
          extractedText = await parseDocxBuffer(buffer);
        } else {
          extractedText = await parsePdfBuffer(buffer);
        }
      }
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return NextResponse.json(
        { error: "Unable to extract sufficient text from the resume. Please check the file or paste your resume text." },
        { status: 400 }
      );
    }

    // Check cache first to avoid re-parsing costs
    const hash = generateResumeHash(extractedText);
    const cached = getCachedResume(hash);
    if (cached) {
      return NextResponse.json({
        data: cached,
        cached: true,
      });
    }

    // Parse with AI and validate output with Zod
    const parsedData = await parseResumeWithAI(extractedText);
    const validated = ParsedResumeSchema.parse(parsedData);

    // Save to cache
    setCachedResume(hash, validated);

    return NextResponse.json({
      data: validated,
      cached: false,
    });
  } catch (err: any) {
    console.error("Resume parsing error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to parse resume. Please try again." },
      { status: 500 }
    );
  }
}

