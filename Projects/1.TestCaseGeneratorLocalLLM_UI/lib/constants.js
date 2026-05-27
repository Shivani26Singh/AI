export const MODELS = [
  { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B" },
  { id: "meta-llama/llama-4-scout-17b-16e-instruct", label: "Llama 4 Scout 17B" },
  { id: "qwen/qwen3-32b", label: "Qwen 3 32B" },
  { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B" },
];

export const DEFAULT_MODEL = MODELS[0].id;

export const TEMPERATURE_PRESETS = [
  { value: 0.0, label: "0.0 — Precise" },
  { value: 0.3, label: "0.3 — Focused" },
  { value: 0.7, label: "0.7 — Balanced" },
  { value: 1.0, label: "1.0 — Creative" },
];

export const MAX_TOKENS_PRESETS = [
  { value: 1024, label: "1,024" },
  { value: 2048, label: "2,048" },
  { value: 4096, label: "4,096" },
  { value: 8192, label: "8,192" },
];

export const DEFAULT_TEMPERATURE = 0.7;
export const DEFAULT_MAX_TOKENS = 4096;

export const SUPPORTED_FILE_TYPES = [
  { mime: "application/pdf", ext: ".pdf" },
  {
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ext: ".docx",
  },
  { mime: "text/plain", ext: ".txt" },
];

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
