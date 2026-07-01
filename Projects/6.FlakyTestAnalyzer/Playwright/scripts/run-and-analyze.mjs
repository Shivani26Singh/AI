#!/usr/bin/env node

/**
 * run-and-analyze.mjs
 * ===================
 * End-to-end pipeline:
 *   1. Run Playwright suite twice (Build A / Build B)
 *   2. Upload both result files to the Langflow Flaky Test Analyzer
 *   3. Print the AI analysis to the terminal
 *
 * Usage:
 *   node scripts/run-and-analyze.mjs
 *
 * Or with environment variables:
 *   LANGFLOW_URL=http://localhost:7861   node scripts/run-and-analyze.mjs
 *   LANGFLOW_KEY=sk-...                  node scripts/run-and-analyze.mjs
 *   GROQ_KEY=gsk_...                     node scripts/run-and-analyze.mjs
 */

import { execSync } from 'child_process';
import { writeFileSync, copyFileSync, existsSync, unlinkSync, mkdirSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';

// ─── Config ───────────────────────────────────────────────────────────────

const ROOT = resolve(import.meta.dirname, '..');
const LANGFLOW_URL  = (process.env.LANGFLOW_URL  || 'http://localhost:7861').replace(/\/+$/, '');
const LANGFLOW_KEY  = process.env.LANGFLOW_KEY   || process.env.LANGFLOW_API_KEY || '';
const GROQ_KEY      = process.env.GROQ_KEY        || '';
const FLOW_ID       = process.env.FLOW_ID  || 'b85a9ffb-cfc5-46d1-8516-4b351d6d187e';
const GROQ_MODEL_ID = process.env.GROQ_MODEL_ID || 'GroqModel-abpDp';
const FILE_ID_A     = process.env.FILE_ID_A || 'File-HtpAM';
const FILE_ID_B     = process.env.FILE_ID_B || 'File-Nv50X';
const SESSION_ID    = `cli-${Date.now()}`;

// ─── Step 1 — Run Playwright twice ───────────────────────────────────────

function runPlaywright(label, counter, outputPath) {
  console.log(`\n═══ ${label} ═══\n`);

  // Write run counter so flake pattern differs
  writeFileSync(resolve(ROOT, '.run-counter'), String(counter));

  const tmpResult = resolve(ROOT, `results/tmp-run-${counter}.json`);
  mkdirSync(dirname(tmpResult), { recursive: true });

  try {
    execSync('npx playwright test', {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env, RESULT_OUTPUT: tmpResult },
    });
  } catch {
    // Test failures are expected — the reporter still writes the JSON
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  copyFileSync(tmpResult, outputPath);
  console.log(`  ✅ Saved → ${outputPath}\n`);
}

// ─── Step 2 — Upload file to Langflow ────────────────────────────────────

async function uploadFile(filePath, fileId) {
  // Use curl to avoid Node.js FormData compatibility issues with Langflow
  const cmd = `curl -s -o - -w "\\n%{http_code}" -X POST "${LANGFLOW_URL}/api/v1/files/upload/${FLOW_ID}" -F "file=@${filePath};filename=${fileId}.json"`;
  const out = execSync(cmd, { encoding: 'utf-8', timeout: 30000 });

  const lines = out.trim().split('\n');
  const statusCode = parseInt(lines.pop(), 10);
  const body = lines.join('\n');

  if (statusCode >= 400) {
    throw new Error(`Upload failed for ${fileId} (${statusCode}): ${body}`);
  }

  const data = JSON.parse(body);
  if (!data?.file_path) throw new Error(`Upload ${fileId} returned no file_path`);
  console.log(`  📤 Uploaded ${fileId} → ${data.file_path}`);
  return data.file_path;
}

// ─── Step 3 — Run flow ───────────────────────────────────────────────────

async function runAnalysis(pathA, pathB) {
  console.log('\n  🔍 Running Langflow analysis...\n');

  const tweaks = {
    [FILE_ID_A]: { path: [pathA] },
    [FILE_ID_B]: { path: [pathB] },
  };
  if (GROQ_KEY) tweaks[GROQ_MODEL_ID] = { api_key: GROQ_KEY };

  const res = await fetch(`${LANGFLOW_URL}/api/v1/run/${FLOW_ID}?stream=false`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': LANGFLOW_KEY },
    body: JSON.stringify({
      output_type: 'chat',
      input_type: 'text',
      input_value: 'Analyze these two Playwright runs and identify flaky tests.',
      session_id: SESSION_ID,
      tweaks,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Analysis failed (${res.status}): ${text}`);
  }

  return res.json();
}

// ─── Step 4 — Extract report from response ───────────────────────────────

function extractReport(resp) {
  const out = resp?.outputs?.[0]?.outputs?.[0];
  const message = out?.results?.message;
  const text = message?.text
    || out?.artifacts?.message
    || out?.outputs?.message?.message
    || JSON.stringify(resp, null, 2);

  const usage = message?.properties?.usage || null;
  const model = message?.properties?.source?.source || null;
  return { text, usage, model };
}

// ─── Main ────────────────────────────────────────────────────────────────

async function main() {
  const RESULT_A = resolve(ROOT, '..', 'Input', 'result1.json');
  const RESULT_B = resolve(ROOT, '..', 'Input', 'result2.json');

  // Clear counter so runs start fresh
  const counterPath = resolve(ROOT, '.run-counter');
  if (existsSync(counterPath)) unlinkSync(counterPath);

  // Step 1 — Run tests twice
  runPlaywright('Build A (baseline)',  1, RESULT_A);
  runPlaywright('Build B (candidate)', 2, RESULT_B);

  // Check Langflow is reachable
  try {
    await fetch(`${LANGFLOW_URL}/health`, { signal: AbortSignal.timeout(3000) });
  } catch {
    console.log(`\n⚠️  LangFlow not reachable at ${LANGFLOW_URL}.`);
    console.log('   Results are saved to Input/result1.json and Input/result2.json.');
    console.log('   Start LangFlow and re-run to get AI analysis, or use the UI:\n');
    console.log(`     cd Project/ui && npm run dev\n`);
    process.exit(0);
  }

  // Step 2 — Upload
  console.log(`\n═══ Uploading results to Langflow ═══\n`);
  const [pathA, pathB] = await Promise.all([
    uploadFile(RESULT_A, FILE_ID_A),
    uploadFile(RESULT_B, FILE_ID_B),
  ]);

  // Step 3 — Analyze
  const raw = await runAnalysis(pathA, pathB);

  // Step 4 — Print report
  const { text, usage, model } = extractReport(raw);

  console.log(`\n${'═'.repeat(58)}`);
  console.log('  🧪 Flaky Test Analysis Report');
  console.log(`${'═'.repeat(58)}\n`);
  console.log(text);

  if (model || usage) {
    console.log(`\n${'─'.repeat(58)}`);
    if (model)  console.log(`  Model       · ${model}`);
    if (usage)  console.log(`  Tokens      · ↑${usage.input_tokens}  ↓${usage.output_tokens}  (${usage.total_tokens})`);
    console.log(`${'─'.repeat(58)}`);
  }

  console.log(`\n✅ Done. Full result at Input/result1.json and Input/result2.json\n`);
}

main().catch((err) => {
  console.error('\n❌', err.message || err);
  process.exit(1);
});
