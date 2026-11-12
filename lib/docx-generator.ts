import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

export async function generateCoverLetterDocx(data: {
  applicantName: string;
  applicantEmail?: string | null;
  applicantPhone?: string | null;
  applicantLocation?: string | null;
  jobTitle: string;
  company: string;
  letterText: string;
}): Promise<Buffer> {
  const paragraphs = data.letterText
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(Boolean);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header: Applicant Name
          new Paragraph({
            text: data.applicantName || "Applicant",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.LEFT,
            spacing: { after: 100 },
          }),
          // Contact info line
          new Paragraph({
            children: [
              new TextRun({
                text: [data.applicantEmail, data.applicantPhone, data.applicantLocation]
                  .filter(Boolean)
                  .join(" | "),
                italics: true,
                color: "555555",
              }),
            ],
            spacing: { after: 300 },
          }),
          // Date
          new Paragraph({
            text: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            spacing: { after: 200 },
          }),
          // Target recipient
          new Paragraph({
            children: [
              new TextRun({ text: `Hiring Team for ${data.jobTitle}`, bold: true }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: data.company, bold: true }),
            ],
            spacing: { after: 300 },
          }),
          // Letter body paragraphs
          ...paragraphs.map(
            (p) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: p,
                    size: 24, // 12pt
                  }),
                ],
                spacing: { after: 200, line: 360 }, // 1.5 line spacing
              })
          ),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

