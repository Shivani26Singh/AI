const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

const ALLOWED_EXTENSIONS = new Set([".pdf", ".docx", ".txt"]);

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function getFileExtension(filename) {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) return "";
  return filename.slice(lastDot).toLowerCase();
}

export function isValidFileType(file) {
  const ext = getFileExtension(file.name);
  return ALLOWED_EXTENSIONS.has(ext) || ALLOWED_TYPES.has(file.type);
}

export function isUnderSizeLimit(file) {
  return file.size <= MAX_FILE_SIZE;
}

export function getFileValidationError(file) {
  if (!isValidFileType(file)) {
    const ext = getFileExtension(file.name);
    return {
      file,
      error: ext
        ? `Unsupported file type "${ext}". Please upload PDF, DOCX, or TXT files.`
        : "Unsupported file type. Please upload PDF, DOCX, or TXT files.",
    };
  }
  if (!isUnderSizeLimit(file)) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      file,
      error: `File "${file.name}" is ${sizeMB}MB. Maximum allowed size is 10MB.`,
    };
  }
  return null;
}

export function validateFiles(files) {
  const valid = [];
  const errors = [];

  for (const file of files) {
    const validationError = getFileValidationError(file);
    if (validationError) {
      errors.push(validationError);
    } else {
      valid.push(file);
    }
  }

  return { valid, errors };
}
