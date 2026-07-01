// Thin client for the LangFlow Flaky Test Analyzer flow.
//
// Two calls per analysis:
//   1) upload each JSON file -> POST /api/v1/files/upload/{flowId}  -> returns a server file_path
//   2) run the flow          -> POST /api/v1/run/{flowId}?stream=false  with those paths as tweaks
//
// Auth: When apiKey is empty, auto-login via GET /api/v1/auto_login and use the
// Bearer token. When apiKey is set, use x-api-key header (may not work for uploads
// in all LangFlow setups).
export const DEFAULTS = {
  apiBase: '',
  apiKey: import.meta.env.VITE_API_KEY || '',
  flowId: 'b85a9ffb-cfc5-46d1-8516-4b351d6d187e',
  fileIdA: 'File-HtpAM',
  fileIdB: 'File-Nv50X',
  groqModelId: 'GroqModel-abpDp',
  groqKey: '',
  prompt:
    'Analyze these two Playwright runs. Identify flaky tests, consistent failures, and give a rerun recommendation.',
}

function trimBase(base) {
  return (base || '').replace(/\/+$/, '')
}

async function readError(res) {
  let detail = ''
  try {
    const body = await res.json()
    detail = body?.detail || body?.message || JSON.stringify(body)
  } catch {
    try {
      detail = await res.text()
    } catch {
      detail = ''
    }
  }
  return `${res.status} ${res.statusText}${detail ? ` — ${detail}` : ''}`
}

let cachedToken = null

async function getAuthHeaders(cfg) {
  if (cfg.apiKey) return { 'x-api-key': cfg.apiKey }
  if (cachedToken) return { Authorization: `Bearer ${cachedToken}` }
  try {
    const res = await fetch(`${trimBase(cfg.apiBase)}/api/v1/auto_login`)
    if (res.ok) {
      const data = await res.json()
      cachedToken = data.access_token
      return { Authorization: `Bearer ${data.access_token}` }
    }
  } catch {}
  return {}
}

// Uploads one file and returns the server-relative path to feed into tweaks.
export async function uploadFile(cfg, file) {
  const { flowId } = cfg
  const form = new FormData()
  form.append('file', file)
  const headers = await getAuthHeaders(cfg)
  const res = await fetch(`${trimBase(cfg.apiBase)}/api/v1/files/upload/${flowId}`, {
    method: 'POST',
    headers,
    body: form,
  })
  if (!res.ok) throw new Error(`Upload failed for "${file.name}": ${await readError(res)}`)
  const data = await res.json()
  if (!data?.file_path) throw new Error(`Upload of "${file.name}" returned no file_path`)
  return data.file_path
}

// Runs the flow with the two uploaded paths and a prompt. Returns the raw response.
export async function runFlow(cfg, { pathA, pathB, prompt, sessionId }) {
  const { flowId, fileIdA, fileIdB, groqModelId, groqKey } = cfg
  const tweaks = {
    [fileIdA]: { path: [pathA] },
    [fileIdB]: { path: [pathB] },
  }
  if (groqKey) tweaks[groqModelId] = { api_key: groqKey }
  const headers = { ...(await getAuthHeaders(cfg)), 'Content-Type': 'application/json' }
  const res = await fetch(`${trimBase(cfg.apiBase)}/api/v1/run/${flowId}?stream=false`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      output_type: 'chat',
      input_type: 'text',
      input_value: prompt,
      session_id: sessionId,
      tweaks,
    }),
  })
  if (!res.ok) throw new Error(`Analysis failed: ${await readError(res)}`)
  return res.json()
}

// Digs the assistant text + token usage out of LangFlow's deeply nested response.
export function parseResult(resp) {
  const out = resp?.outputs?.[0]?.outputs?.[0]
  const message = out?.results?.message
  const text =
    message?.text ??
    out?.artifacts?.message ??
    out?.outputs?.message?.message ??
    out?.messages?.[0]?.message ??
    ''
  const usage = message?.properties?.usage || null
  const model = message?.properties?.source?.source || message?.properties?.source?.display_name || null
  return { text, usage, model, sessionId: resp?.session_id || null }
}

// Full pipeline used by the UI.
export async function analyze(cfg, { fileA, fileB, prompt, sessionId }) {
  const [pathA, pathB] = await Promise.all([
    uploadFile(cfg, fileA),
    uploadFile(cfg, fileB),
  ])
  const raw = await runFlow(cfg, { pathA, pathB, prompt, sessionId })
  return { ...parseResult(raw), raw, pathA, pathB }
}
