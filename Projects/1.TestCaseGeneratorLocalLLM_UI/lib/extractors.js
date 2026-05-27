import { extractPdfText } from "@/app/actions/extractors";

function fileToArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Failed to encode file"));
        return;
      }
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

async function extractDocxText(file) {
  try {
    const arrayBuffer = await fileToArrayBuffer(file);
    const mammoth = (await import("mammoth")).default;
    const result = await mammoth.extractRawText({ arrayBuffer });
    return { success: true, text: result.value };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to extract text from DOCX";
    return { success: false, error: `DOCX extraction failed: ${message}` };
  }
}

async function extractTxtText(file) {
  try {
    const text = await file.text();
    if (!text.trim()) {
      return { success: false, error: "TXT file is empty." };
    }
    return { success: true, text };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to read TXT file";
    return { success: false, error: `TXT read failed: ${message}` };
  }
}

async function extractPdf(file) {
  try {
    const base64 = await fileToBase64(file);
    return await extractPdfText(base64);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to extract text from PDF";
    return { success: false, error: `PDF extraction failed: ${message}` };
  }
}

export async function extractFileContent(file) {
  const type = file.type;
  const name = file.name.toLowerCase();

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    return await extractPdf(file);
  }

  if (
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    return await extractDocxText(file);
  }

  if (type === "text/plain" || name.endsWith(".txt")) {
    return await extractTxtText(file);
  }

  return {
    success: false,
    error: `Unsupported file type for "${file.name}".`,
  };
}

export async function extractFiles(files, onProgress) {
  const results = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (onProgress) {
      onProgress(i, files.length, file.name);
    }

    const result = await extractFileContent(file);
    results.push({
      fileName: file.name,
      fileType: file.type,
      ...result,
    });
  }

  return results;
}
