export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line
  const pdfParse = require("pdf-parse");
  const data = await pdfParse(buffer);
  return data.text || "";
}

