"use server";

import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import { pathToFileURL } from "url";

pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(
  `${process.cwd()}/node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs`
).toString();

export async function extractPdfText(base64Data) {
  try {
    const buffer = Buffer.from(base64Data, "base64");
    const data = new Uint8Array(buffer);

    const doc = await pdfjs.getDocument({
      data,
      disableWorker: true,
      verbosity: 0,
    }).promise;

    const pages = [];

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      pages.push(
        content.items
          .filter((item) => "str" in item && item.str)
          .map((item) => item.str)
          .join(" ")
      );
    }

    return { success: true, text: pages.join("\n\n") };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to extract text from PDF";
    return { success: false, error: `PDF extraction failed: ${message}` };
  }
}
