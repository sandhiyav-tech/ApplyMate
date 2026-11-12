import { NextRequest, NextResponse } from "next/server";
import { generateCoverLetterDocx } from "@/lib/docx-generator";
import { z } from "zod";

export const maxDuration = 60;

const DownloadDocxSchema = z.object({
  applicantName: z.string().default("Applicant"),
  applicantEmail: z.string().optional(),
  applicantPhone: z.string().optional(),
  applicantLocation: z.string().optional(),
  jobTitle: z.string().default("Internship"),
  company: z.string().default("Company"),
  letterText: z.string().min(10, "Letter text is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = DownloadDocxSchema.parse(body);

    const docxBuffer = await generateCoverLetterDocx(data);

    const safeCompanyName = data.company.replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `Cover_Letter_${safeCompanyName}.docx`;

    const uint8Array = new Uint8Array(docxBuffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": uint8Array.byteLength.toString(),
      },
    });
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    console.error("DOCX download error:", errorMsg);
    return NextResponse.json(
      { error: errorMsg || "Failed to generate DOCX file." },
      { status: 500 }
    );
  }
}
