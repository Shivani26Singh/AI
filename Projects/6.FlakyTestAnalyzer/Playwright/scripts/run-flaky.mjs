/**
 * Runs the Playwright test suite twice and outputs result1.json / result2.json
 * in the format the Flaky Test Analyzer LangFlow agent expects.
 *
 * The .run-counter file makes each run produce a different flake pattern,
 * so two runs naturally yield different pass/fail sets — exactly what the
 * analyzer needs to compare Build A vs Build B.
 */
import { execSync } from 'child_process';
import { writeFileSync, copyFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';

const ROOT = resolve(import.meta.dirname, '..');

const RUNS = [
  { label: 'Build A (baseline)',  output: 'Input/result1.json', counter: 0 },
  { label: 'Build B (candidate)', output: 'Input/result2.json', counter: 1 },
];

for (const run of RUNS) {
  // Write the run counter so each build gets a different flake pattern
  writeFileSync(resolve(ROOT, '.run-counter'), String(run.counter));
  console.log(`\n═══════════════════════════════════════════════`);
  console.log(`  🎯 ${run.label}`);
  console.log(`═══════════════════════════════════════════════\n`);

  // Use a unique temp output per run
  const tmpOutput = resolve(ROOT, `results/tmp-${run.label.replace(/\s/g, '-')}.json`);
  mkdirSync(dirname(tmpOutput), { recursive: true });

  try {
    execSync('npx playwright test', {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env, RESULT_OUTPUT: tmpOutput },
    });
  } catch {
    // Test failures are expected — the reporter still writes the JSON
  }

  // Copy to the final input location (relative to project root)
  const finalPath = resolve(ROOT, '..', run.output);
  mkdirSync(dirname(finalPath), { recursive: true });
  copyFileSync(tmpOutput, finalPath);

  console.log(`\n  ✅ Saved → ${resolve('..', run.output)}\n`);
}

console.log(`\n✅ Done! Results ready at:
  Input/result1.json  — Build A
  Input/result2.json  — Build B
`);
