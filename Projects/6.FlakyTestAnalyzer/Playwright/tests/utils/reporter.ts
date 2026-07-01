import type { FullConfig, FullResult, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { writeFileSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';

interface SpecResult {
  status: string;
  duration: number;
  retry: number;
}

interface TestEntry {
  status: string;
  results: SpecResult[];
}

interface SpecEntry {
  title: string;
  ok: boolean;
  tests: TestEntry[];
}

interface SuiteEntry {
  title: string;
  specs: SpecEntry[];
}

interface FlakyReport {
  config: { version: string };
  suites: SuiteEntry[];
  errors: { spec: string; test: string; message: string }[];
  stats: {
    startTime: string;
    duration: number;
    expected: number;
    skipped: number;
    unexpected: number;
    flaky: number;
  };
}

function outcomeStatus(tc: TestCase): string {
  if (tc.expectedStatus === 'skipped') return 'skipped';
  const latest = tc.results?.[tc.results.length - 1];
  if (!latest) return 'skipped';
  // Matches expected? e.g. expectedStatus='passed' and result='passed'
  if (latest.status === tc.expectedStatus) return 'expected';
  return 'unexpected';
}

function isFlaky(tc: TestCase): boolean {
  if (!tc.results || tc.results.length < 2) return false;
  const statuses = new Set(tc.results.map((r) => r.status));
  const hasPass = statuses.has('passed');
  const hasFail = statuses.has('failed') || statuses.has('timedOut');
  return hasPass && hasFail;
}

export default class FlakyAnalyzerReporter {
  private config: FullConfig | null = null;
  private rootSuite: Suite | null = null;
  private runResult: FullResult | null = null;

  onBegin(config: FullConfig, suite: Suite) {
    this.config = config;
    this.rootSuite = suite;
  }

  onEnd(result: FullResult) {
    this.runResult = result;
    if (!this.rootSuite || !this.config) return;

    const outputPath = process.env.RESULT_OUTPUT || './results/results.json';
    const report = this.buildReport();

    mkdirSync(join(outputPath, '..'), { recursive: true });
    writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`\n  ✅ Flaky report saved → ${resolve(outputPath)}`);
  }

  private buildReport(): FlakyReport {
    const allTests = this.collectTests(this.rootSuite!);
    const suites: SuiteEntry[] = [];
    const allErrors: { spec: string; test: string; message: string }[] = [];

    let totalExpected = 0;
    let totalSkipped = 0;
    let totalUnexpected = 0;
    let totalFlaky = 0;

    // Group tests by their parent suite title
    const suiteMap = new Map<string, TestCase[]>();
    for (const tc of allTests) {
      const suiteTitle = tc.parent?.title || 'root';
      if (!suiteMap.has(suiteTitle)) suiteMap.set(suiteTitle, []);
      suiteMap.get(suiteTitle)!.push(tc);
    }

    for (const [suiteTitle, testCases] of suiteMap) {
      const specs: SpecEntry[] = testCases.map((tc) => {
        const results: SpecResult[] = (tc.results ?? []).map((r) => ({
          status: r.status,
          duration: r.duration,
          retry: r.retry,
        }));

        // Collect errors for this test
        for (const r of tc.results ?? []) {
          if (r.error?.message) {
            allErrors.push({
              spec: suiteTitle,
              test: tc.title,
              message: r.error.message,
            });
          }
        }

        const latest = results[results.length - 1];
        const ok = latest ? latest.status === 'passed' : false;

        return {
          title: tc.title,
          ok,
          tests: [
            {
              status: outcomeStatus(tc),
              results,
            },
          ],
        };
      });

      suites.push({ title: suiteTitle, specs });
    }

    // Count stats
    for (const tc of allTests) {
      if (tc.expectedStatus === 'skipped') {
        totalSkipped++;
      } else if (isFlaky(tc)) {
        totalFlaky++;
      } else if (outcomeStatus(tc) === 'unexpected') {
        totalUnexpected++;
      } else {
        totalExpected++;
      }
    }

    const runResult = this.runResult!;

    return {
      config: { version: this.config!.version },
      suites,
      errors: allErrors,
      stats: {
        startTime: runResult.startTime.toISOString(),
        duration: runResult.duration,
        expected: totalExpected,
        skipped: totalSkipped,
        unexpected: totalUnexpected,
        flaky: totalFlaky,
      },
    };
  }

  private collectTests(suite: Suite): TestCase[] {
    const tests: TestCase[] = [];
    for (const child of suite.suites ?? []) {
      tests.push(...this.collectTests(child));
    }
    for (const test of suite.tests ?? []) {
      tests.push(test);
    }
    return tests;
  }

  printsToStdio() {
    return false;
  }
}
