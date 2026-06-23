import type { FullConfig, FullResult, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface FlakySpec {
  title: string;
  ok: boolean;
  tests: { results: { status: string }[] }[];
}

interface FlakySuite {
  title: string;
  specs: FlakySpec[];
}

interface FlakyReport {
  suites: FlakySuite[];
}

type TestTreeNode = {
  suite: Suite;
  tests: TestCase[];
};

export default class FlakyAnalyzerReporter {
  private rootSuite: Suite | null = null;

  onBegin(_config: FullConfig, suite: Suite) {
    this.rootSuite = suite;
  }

  onEnd(_result: FullResult) {
    if (!this.rootSuite) return;

    const outputPath = process.env.RESULT_OUTPUT || './results/results.json';
    const report = this.buildReport(this.rootSuite);

    mkdirSync(join(outputPath, '..'), { recursive: true });
    writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`\n  ✅ Flaky report saved → ${outputPath}`);
  }

  private buildReport(suite: Suite): FlakyReport {
    const suites: FlakySuite[] = [];

    for (const child of suite.suites ?? []) {
      const s = this.flattenSuite(child);
      if (s) suites.push(s);
    }

    return { suites };
  }

  private flattenSuite(suite: Suite): FlakySuite | null {
    // Collect all test cases in this suite tree
    const tests = this.collectTests(suite);
    if (tests.length === 0) return null;

    const specs: FlakySpec[] = tests.map((t) => {
      const results = t.results?.map((r) => ({ status: r.status })) ?? [];
      // A spec is "ok" if the latest result passed
      const ok = results.length > 0 ? results[results.length - 1].status === 'passed' : false;
      return {
        title: t.title,
        ok,
        tests: [{ results }],
      };
    });

    return { title: suite.title || 'root', specs };
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
