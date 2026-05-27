import { DEFAULT_MODEL, MODELS } from "@/lib/constants";

const VALID_MODELS = new Set(MODELS.map((m) => m.id));

const MIN_TEMPERATURE = 0;
const MAX_TEMPERATURE = 2;
const MIN_TOKENS = 256;
const MAX_TOKENS = 32768;

const API_KEY_PATTERN = /^gsk_[a-zA-Z0-9]{20,}$/;

const VALIDATION_MESSAGES = {
  model: "Please select a valid model.",
  temperature: `Temperature must be between ${MIN_TEMPERATURE} and ${MAX_TEMPERATURE}.`,
  maxTokens: `Max tokens must be between ${MIN_TOKENS} and ${MAX_TOKENS}.`,
  apiKeyInvalid: "API key format is invalid. Keys start with 'gsk_' followed by at least 20 characters.",
  apiKeyEmpty: "API key is empty. A key or a server environment variable is required.",
};

export function validateSettings(settings) {
  const errors = {};

  if (!settings.model || !VALID_MODELS.has(settings.model)) {
    errors.model = VALIDATION_MESSAGES.model;
  }

  const temp = Number(settings.temperature);
  if (isNaN(temp) || temp < MIN_TEMPERATURE || temp > MAX_TEMPERATURE) {
    errors.temperature = VALIDATION_MESSAGES.temperature;
  }

  const tokens = Number(settings.maxTokens);
  if (
    isNaN(tokens) ||
    tokens < MIN_TOKENS ||
    tokens > MAX_TOKENS ||
    !Number.isInteger(tokens)
  ) {
    errors.maxTokens = VALIDATION_MESSAGES.maxTokens;
  }

  if (settings.apiKey && settings.apiKey.trim().length > 0) {
    if (!API_KEY_PATTERN.test(settings.apiKey.trim())) {
      errors.apiKey = VALIDATION_MESSAGES.apiKeyInvalid;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function getDefaultSettings() {
  return {
    apiKey: "",
    model: DEFAULT_MODEL,
    temperature: 0.7,
    maxTokens: 4096,
  };
}

export function getSettingsSummary(settings, hasEnvKey) {
  const parts = [];
  parts.push(`Model: ${settings.model}`);
  parts.push(`Temperature: ${settings.temperature}`);
  parts.push(`Max tokens: ${settings.maxTokens.toLocaleString()}`);
  if (settings.apiKey) {
    const masked = settings.apiKey.slice(0, 8) + "..." + settings.apiKey.slice(-4);
    parts.push(`API key: ${masked}`);
  } else if (hasEnvKey) {
    parts.push("API key: using server environment variable");
  } else {
    parts.push("API key: not configured");
  }
  return parts.join(" · ");
}
